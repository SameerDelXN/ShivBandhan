import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export async function POST(request) {
  try {
    const { userData } = await request.json();
    console.log("User Data:", userData);
    
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();
    const margin = 40;
    const contentWidth = width - 2 * margin;

    // Colors
    const primaryRed = rgb(0.8, 0.2, 0.2);
    const darkText = rgb(0.1, 0.1, 0.1);
    const lightText = rgb(0.4, 0.4, 0.4);
    const borderGray = rgb(0.85, 0.85, 0.85);
    const accentBlue = rgb(0.2, 0.4, 0.8);
    const lightGray = rgb(0.95, 0.95, 0.95);

    // Load and embed company logo
    let logoImage;
    try {
      const fs = require('fs');
      const path = require('path');
      const logoPath = path.join(process.cwd(), 'public', 'logo.png');
      const logoBytes = fs.readFileSync(logoPath);
      logoImage = await pdfDoc.embedPng(logoBytes);
    } catch (error) {
      console.warn('Logo not found, proceeding without it:', error.message);
    }

    // Load and embed user profile image if available
    let profileImage;
    if (userData.profilePhoto) {
      try {
        const response = await fetch(userData.profilePhoto);
        if (response.ok) {
          const imageBuffer = await response.arrayBuffer();
          try {
            profileImage = await pdfDoc.embedJpg(imageBuffer);
          } catch (e) {
            try {
              profileImage = await pdfDoc.embedPng(imageBuffer);
            } catch (pngError) {
              console.warn('Could not embed profile image as JPEG or PNG:', pngError.message);
            }
          }
        }
      } catch (error) {
        console.warn('Could not load profile image:', error.message);
      }
    }

    const sanitizeText = (text) => {
      if (!text) return '';
      return text.toString().replace(/₹/g, 'Rs.').replace(/[^\x00-\x7F]/g, '');
    };

    const drawText = (text, x, y, options = {}) => {
      const fontSize = options.size || 11;
      const font = options.bold ? boldFont : (options.italic ? italicFont : regularFont);
      const color = options.color || darkText;
      const safeText = sanitizeText(text);

      try {
        page.drawText(safeText, {
          x,
          y,
          size: fontSize,
          font,
          color,
          maxWidth: options.maxWidth || contentWidth,
          ...options,
        });
      } catch (error) {
        console.warn('Text draw error:', error.message);
        page.drawText('[Text error]', {
          x, y, size: fontSize, font: regularFont, color: lightText
        });
      }
    };

    const formatDate = (date) => {
      if (!date) return '';
      
      try {
        const d = new Date(date);
        return isNaN(d) ? date : d.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        });
      } catch (e) {
        return date;
      }
    };

    const calculateAge = (dob) => {
      if (!dob) return '';
      
      const birthDate = new Date(dob);
      if (isNaN(birthDate)) return '';
      
      const ageDiff = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDiff);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    let currentY = height - margin - 20;

    // HEADER WITH LOGO
    if (logoImage) {
      const logoDims = logoImage.scale(0.15);
      page.drawImage(logoImage, {
        x: margin,
        y: currentY - logoDims.height / 2,
        width: logoDims.width,
        height: logoDims.height,
      });
    }

    // Company name and branding
    const headerX = logoImage ? margin + 120 : margin;
    drawText('SHIVBANDHAN MATRIMONIAL SERVICES', headerX, currentY, {
      size: 16,
      bold: true,
      color: primaryRed
    });
    currentY -= 25;

    drawText('Yashganga Complex, F No- 306, Nr Hotel Deccan Povilon Navale Bridge,Katraj Bypass Road,', 
             headerX, currentY, {
      size: 9,
      color: darkText
    });
    currentY -= 12;

    drawText('Narhe, Pune- 411041 , Maharashtra, India', 
             headerX, currentY, {
      size: 9,
      color: darkText
    });
    currentY -= 12;

    drawText('Website: www.shivbandhan.com', 
             headerX, currentY, {
      size: 9,
      color: accentBlue,
      italic: true
    });
    currentY -= 50;

    // Horizontal divider
    page.drawLine({
      start: { x: margin, y: currentY },
      end: { x: width - margin, y: currentY },
      thickness: 1,
      color: borderGray
    });
    currentY -= 50;

    // Profile ID
    const profileId = userData._id ? userData._id.toString().slice(-6).toUpperCase() : 
                     Date.now().toString().slice(-6);
    
    // Calculate text area width based on whether we have a profile image
    const textAreaWidth = profileImage ? contentWidth - 180 : contentWidth;
    
    // Draw profile image if available
    if (profileImage) {
      const imgDims = profileImage.scale(0.35);
      const imgX = width - margin - imgDims.width - 10;
      const imgY = currentY - 5;
      
      // Draw a border around the image
      page.drawRectangle({
        x: imgX - 5,
        y: imgY - 5,
        width: imgDims.width + 10,
        height: imgDims.height + 10,
        borderColor: borderGray,
        borderWidth: 1,
      });
      
      page.drawImage(profileImage, {
        x: imgX,
        y: imgY,
        width: imgDims.width,
        height: imgDims.height,
      });
    }
    
    // Background for profile header
    const profileHeaderHeight = profileImage ? 80 : 60;
    page.drawRectangle({
      x: margin,
      y: currentY + 5,
      width: textAreaWidth,
      height: profileHeaderHeight,
      color: lightGray,
      opacity: 0.3
    });

    // Name with proper text wrapping
    const name = userData.name || 'N/A';
    drawText(name, margin + 10, currentY + 55, {
      size: 18,
      bold: true,
      color: primaryRed,
      maxWidth: textAreaWidth - 20
    });
    
    // Profile ID
    const profileIdText = `Profile ID: SB-${profileId}`;
    const profileIdWidth = boldFont.widthOfTextAtSize(profileIdText, 10);
    drawText(profileIdText, margin + textAreaWidth - profileIdWidth, currentY + 55, {
      size: 10,
      color: lightText
    });
    
    // DOB and Age
    const dobText = `DOB: ${formatDate(userData.dob) || 'N/A'} | Age: ${calculateAge(userData.dob) || 'N/A'} years`;
    drawText(dobText, margin + 10, currentY + 35, {
      size: 10,
      color: darkText,
      maxWidth: textAreaWidth - 20
    });
    
    // Gender and Education
    const genderEduText = `Gender: ${userData.gender || 'N/A'} | Education: ${userData.education || 'N/A'}`;
    drawText(genderEduText, margin + 10, currentY + 20, {
      size: 10,
      color: darkText,
      maxWidth: textAreaWidth - 20
    });
    
    currentY -= (profileHeaderHeight + 15);

    // Draw section function
    const drawSection = (title, data) => {
      if (data.filter(([_, value]) => value !== undefined && value !== null && value !== '').length === 0) return currentY;

      // Section header with background
      page.drawRectangle({
        x: margin,
        y: currentY + 2,
        width: contentWidth,
        height: 20,
        color: primaryRed,
        opacity: 0.1
      });

      drawText(title.toUpperCase(), margin + 10, currentY + 5, {
        size: 12,
        bold: true,
        color: primaryRed
      });
      currentY -= 20;

      // Section content with alternating row colors
      const rows = data.filter(([_, value]) => value !== undefined && value !== null && value !== '');
      
      rows.forEach(([label, value], index) => {
        if (index % 2 === 0) {
          page.drawRectangle({
            x: margin,
            y: currentY - 2,
            width: contentWidth,
            height: 16,
            color: lightGray,
            opacity: 0.2
          });
        }

        const display = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : 
                       (Array.isArray(value) ? value.join(', ') : value);

        drawText(`${label}:`, margin + 10, currentY, { size: 10, bold: true });
        drawText(sanitizeText(display.toString()), margin + 120, currentY, { 
          size: 10,
          maxWidth: contentWidth - 130
        });
        currentY -= 16;
      });

      currentY -= 10;
      return currentY;
    };

    // Personal Information Section
    currentY = drawSection('Personal Information', [
      ['Full Name', userData.name],
      ['Date of Birth', formatDate(userData.dob)],
      ['Age', calculateAge(userData.dob) + ' years'],
      ['Gender', userData.gender],
      ['Marital Status', userData.maritalStatus],
      ['Divorcee', userData.divorcee],
      ['Height', userData.height],
      ['Wears Lens', userData.wearsLens],
      ['Mother Tongue', userData.motherTongue],
      ['Current City', userData.currentCity]
    ]);

    // Family Background Section
    currentY = drawSection('Family Background', [
      ['Religion', userData.religion],
      ['Caste', userData.caste],
      ['Gothra', userData.gothra],
      ['Brothers', userData.brothers],
      ['Married Brothers', userData.marriedBrothers],
      ['Sisters', userData.sisters],
      ['Married Sisters', userData.marriedSisters],
      ['Relative Surnames', userData.relativeSurname && userData.relativeSurname.join(', ')]
    ]);

    // Education & Career Section
    currentY = drawSection('Education & Career', [
      ['Education', userData.education],
      ['Field of Study', userData.fieldOfStudy],
      ['College', userData.college],
      ['Occupation', userData.occupation],
      ['Company', userData.company],
      ['Annual Income', userData.income]
    ]);

    // Account Information Section
    currentY = drawSection('Account Information', [
      ['Profile Verified', userData.isVerified],
      ['Verification Status', userData.verificationStatus],
      ['Last Login', formatDate(userData.lastLoginAt)],
      ['Profile Created', formatDate(userData.createdAt)],
      ['Profile Updated', formatDate(userData.updatedAt)],
      ['Subscription Status', userData.subscription && userData.subscription.isSubscribed ? 'Active' : 'Inactive']
    ]);

    // Footer with branding
    currentY = Math.max(currentY - 20, 60);
    
    // Footer divider
    page.drawLine({
      start: { x: margin, y: currentY },
      end: { x: width - margin, y: currentY },
      thickness: 1,
      color: borderGray
    });
    currentY -= 15;

    // Footer content
    drawText('ShivBandhan Matrimonial Services • Trusted Since 2010', margin, currentY, {
      size: 10,
      bold: true,
      color: primaryRed
    });
    currentY -= 12;

    drawText(`Generated on ${new Date().toLocaleDateString('en-IN')}`, width - margin - 120, currentY, {
      size: 9,
      color: lightText
    });
    currentY -= 12;

    drawText('Contact: +91-8888438693 | Email: support@shivbandhan.com | Website: www.shivbandhan.com', 
             margin, currentY, {
      size: 8,
      color: lightText
    });

    // Final PDF
    const pdfBytes = await pdfDoc.save();
    const base64Pdf = Buffer.from(pdfBytes).toString('base64');
    const sanitizedName = (userData.name || 'Profile').replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `ShivBandhan_Profile_${sanitizedName}.pdf`;

    return NextResponse.json({
      success: true,
      pdf: base64Pdf,
      fileName,
      message: 'Profile PDF generated successfully',
      profileId: `SB-${profileId}`
    });

  } catch (error) {
    console.error('PDF Generation Error:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to generate profile PDF',
        error: error.message
      },
      { status: 500 }
    );
  }
}