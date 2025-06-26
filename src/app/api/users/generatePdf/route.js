import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
//sample2
export async function POST(request) {
  try {
    const { userData } = await request.json();
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // Load fonts
    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    // Create page with A4 dimensions
    const page = pdfDoc.addPage([595, 842]);
    const { width, height } = page.getSize();
    const margin = 30;

    // Define brand colors based on ShivBandhan theme
    const primaryRed = rgb(0.8, 0.2, 0.2);
    const accentGold = rgb(0.9, 0.7, 0.2);
    const darkText = rgb(0.1, 0.1, 0.1);
    const lightText = rgb(0.4, 0.4, 0.4);
    const borderGray = rgb(0.85, 0.85, 0.85);
    const backgroundLight = rgb(0.98, 0.98, 0.98);
    const white = rgb(1, 1, 1);

    // Helper function to sanitize text
    const sanitizeText = (text) => {
      if (!text) return '';
      return text.toString()
        .replace(/₹/g, 'Rs.')
        .replace(/[^\x00-\x7F]/g, '?')
        .replace(/\u2013/g, '-')
        .replace(/\u2014/g, '--')
        .replace(/\u2018|\u2019/g, "'")
        .replace(/\u201C|\u201D/g, '"')
        .replace(/\u2026/g, '...');
    };

    // Helper function to draw text safely
    const drawText = (text, x, y, options = {}) => {
      const fontSize = options.size || 10;
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
          maxWidth: options.maxWidth || (width - x - margin),
          lineHeight: options.lineHeight || fontSize * 1.2,
          ...options,
        });
      } catch (error) {
        console.warn('Text encoding failed:', error.message);
        page.drawText('[Text encoding error]', {
          x, y, size: fontSize, font: regularFont, color: rgb(0.7, 0.7, 0.7)
        });
      }
    };

    // Helper function to draw rounded rectangle
    const drawRoundedRect = (x, y, w, h, color, radius = 8) => {
      page.drawRectangle({ x, y, width: w, height: h, color });
    };

    // Helper function to format date
    const formatDate = (date) => {
      if (!date) return '';
      const d = new Date(date);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    };

    // HEADER SECTION
    // Main header background
    drawRoundedRect(0, height - 100, width, 100, primaryRed);
    
    // Gold accent strip
    drawRoundedRect(0, height - 110, width, 10, accentGold);

    // Company logo and branding
    drawText('ShivBandhan', margin, height - 35, {
      size: 32, bold: true, color: white
    });
    
    drawText('Matrimonial Services', margin, height - 55, {
      size: 12, color: rgb(0.9, 0.9, 0.9)
    });

    // Contact information in header
    const contactInfo = [
      'Durga Prasad Apartments, S. No. 26/6, Flat No. 1, Above Udyam Vikas Bank',
      'Hingne KD, Sinhagad Road, Pune 411051, Maharashtra, India',
      'Mobile: +91-8888438693 / +91-8888438694',
      'Email: support@shivbandhan.com | Website: www.shivbandhan.com'
    ];

    contactInfo.forEach((info, index) => {
      drawText(info, margin, height - 75 - (index * 10), {
        size: 8, color: rgb(0.85, 0.85, 0.85)
      });
    });

    // BIODATA title
    drawText('BIODATA', width - 120, height - 40, {
      size: 20, bold: true, color: white
    });

    // Profile photo placeholder
    const photoX = width - 140;
    const photoY = height - 280;
    const photoWidth = 110;
    const photoHeight = 140;
    
    drawRoundedRect(photoX, photoY, photoWidth, photoHeight, backgroundLight);
    page.drawRectangle({
      x: photoX,
      y: photoY,
      width: photoWidth,
      height: photoHeight,
      borderColor: borderGray,
      borderWidth: 1
    });
    
    drawText('Photograph', photoX + 25, photoY + 65, {
      size: 10, color: lightText
    });

    // Available platforms section
    drawText('Available On:', photoX, photoY - 20, {
      size: 10, bold: true, color: primaryRed
    });
    
    const platforms = ['Mobile App', 'Website', 'WhatsApp'];
    platforms.forEach((platform, index) => {
      drawText(`• ${platform}`, photoX, photoY - 35 - (index * 12), {
        size: 8, color: darkText
      });
    });

    // MAIN CONTENT SECTIONS
    let currentY = height - 140;
    const leftColumnWidth = 380;

    // Section drawing function
    const drawSection = (title, data, startY, columnWidth = leftColumnWidth) => {
      let yPos = startY;
      
      // Section header
      drawRoundedRect(margin, yPos - 20, columnWidth, 20, accentGold);
      drawText(title, margin + 8, yPos - 12, {
        size: 12, bold: true, color: darkText
      });
      
      yPos -= 30;
      
      // Calculate section height
      const rowHeight = 18;
      const sectionHeight = (data.length * rowHeight) + 10;
      
      // Section background
      drawRoundedRect(margin, yPos - sectionHeight, columnWidth, sectionHeight, backgroundLight);
      
      // Border
      page.drawRectangle({
        x: margin,
        y: yPos - sectionHeight,
        width: columnWidth,
        height: sectionHeight,
        borderColor: borderGray,
        borderWidth: 1
      });
      
      // Data rows
      data.forEach(([label, value], index) => {
        const rowY = yPos - (index * rowHeight) - 8;
        
        // Alternate row background
        if (index % 2 === 1) {
          drawRoundedRect(margin + 2, rowY - 12, columnWidth - 4, 16, rgb(0.95, 0.95, 0.95));
        }
        
        // Label
        drawText(`${label}:`, margin + 8, rowY, {
          size: 9, bold: true, color: primaryRed, maxWidth: 100
        });
        
        // Value
        drawText(value || 'Not specified', margin + 120, rowY, {
          size: 9, color: darkText, maxWidth: columnWidth - 130
        });
      });
      
      return yPos - sectionHeight - 15;
    };

    // PERSONAL INFORMATION (based on your schema)
    const personalInfo = [
      ['Name', userData.name],
      ['Mobile', userData.phone],
      ['Email', userData.email],
      ['DOB', formatDate(userData.dob)],
      ['Gender', userData.gender],
      ['Marital Status', userData.maritalStatus],
      ['Height', userData.height],
      ['Weight', userData.weight],
      ['Blood Group', userData.bloodGroup],
      ['Complexion', userData.complexion],
      ['Wears Lens', userData.wearsLens ? 'Yes' : 'No'],
      ['Current City', userData.currentCity],
      ['Permanent Address', userData.permanentAddress],
      ['Mother Tongue', userData.motherTongue]
    ];

    currentY = drawSection('PERSONAL INFO', personalInfo.filter(([label, value]) => value), currentY);

    // EDUCATION & CAREER INFO
    const educationInfo = [
      ['Education', userData.education],
      ['Field of Study', userData.fieldOfStudy],
      ['College/University', userData.college],
      ['Occupation', userData.occupation],
      ['Company', userData.company],
      ['Annual Income', userData.income]
    ];

    currentY = drawSection('EDUCATION & CAREER INFO', educationInfo.filter(([label, value]) => value), currentY);

    // RELIGIOUS INFORMATION
    const religiousInfo = [
      ['Religion', userData.religion],
      ['Caste', userData.caste],
      ['Sub Caste', userData.subCaste],
      ['Gothra', userData.gothra]
    ];

    currentY = drawSection('RELIGIOUS INFO', religiousInfo.filter(([label, value]) => value), currentY);

    // FAMILY INFORMATION
    const familyInfo = [
      ['Father Name', userData.fatherName],
      ['Mother Name', userData.mother],
      ['Parent Occupation', userData.parentOccupation],
      ['Parent Residence City', userData.parentResidenceCity],
      ['Brothers', userData.brothers?.toString()],
      ['Married Brothers', userData.marriedBrothers?.toString()],
      ['Sisters', userData.sisters?.toString()],
      ['Married Sisters', userData.marriedSisters?.toString()],
      ['Native District', userData.nativeDistrict],
      ['Native City', userData.nativeCity],
      ['Family Wealth', userData.familyWealth],
      ['Relative Surname', Array.isArray(userData.relativeSurname) ? userData.relativeSurname.join(', ') : userData.relativeSurname],
      ['Mama Surname', userData.mamaSurname]
    ];

    if (familyInfo.some(([label, value]) => value)) {
      currentY = drawSection('FAMILY INFO', familyInfo.filter(([label, value]) => value), currentY);
    }

    // HOROSCOPE INFORMATION
    const horoscopeInfo = [
      ['Rashi', userData.rashi],
      ['Nakshatra', userData.nakshira],
      ['Charan', userData.charan],
      ['Gan', userData.gan],
      ['Nadi', userData.nadi],
      ['Mangal', userData.mangal ? 'Yes' : 'No'],
      ['Birth Place', userData.birthPlace],
      ['Birth Time', userData.birthTime],
      ['Gotra/Devak', userData.gotraDevak]
    ];

    if (horoscopeInfo.some(([label, value]) => value)) {
      currentY = drawSection('HOROSCOPE INFO', horoscopeInfo.filter(([label, value]) => value), currentY);
    }

    // PARTNER EXPECTATIONS
    const expectations = [
      ['Expected Caste', userData.expectedCaste],
      ['Preferred City', userData.preferredCity],
      ['Expected Age Difference', userData.expectedAgeDifference],
      ['Expected Education', userData.expectedEducation],
      ['Expected Height', userData.expectedHeight],
      ['Expected Income', userData.expectedIncome],
      ['Divorcee Acceptable', userData.divorcee ? 'Yes' : 'No']
    ];

    if (expectations.some(([label, value]) => value)) {
      currentY = drawSection('PARTNER EXPECTATIONS', expectations.filter(([label, value]) => value), currentY);
    }

    // PREFERENCES (from preferences object)
    if (userData.preferences) {
      const preferencesInfo = [
        ['Age Range', userData.preferences.ageRange ? `${userData.preferences.ageRange.min} - ${userData.preferences.ageRange.max} years` : ''],
        ['Preferred Religion', userData.preferences.religion],
        ['Preferred Caste', userData.preferences.caste],
        ['Preferred City', userData.preferences.city]
      ];

      if (preferencesInfo.some(([label, value]) => value)) {
        currentY = drawSection('PREFERENCES', preferencesInfo.filter(([label, value]) => value), currentY);
      }
    }

    // ACCOUNT STATUS
    const accountStatus = [
      ['Profile Completion', `${userData.profileCompletion || 0}%`],
      ['Phone Verified', userData.phoneIsVerified ? 'Yes' : 'No'],
      ['Account Verified', userData.isVerified ? 'Yes' : 'No'],
      ['Verification Status', userData.verificationStatus],
      ['Member Since', formatDate(userData.createdAt)],
      ['Last Updated', formatDate(userData.updatedAt)]
    ];

    currentY = drawSection('ACCOUNT STATUS', accountStatus.filter(([label, value]) => value), currentY);

    // SUBSCRIPTION INFO (if subscribed)
    if (userData.subscription && userData.subscription.isSubscribed) {
      const subscriptionInfo = [
        ['Subscription Plan', userData.subscription.plan],
        ['Subscription Status', userData.subscription.isSubscribed ? 'Active' : 'Inactive'],
        ['Expires At', formatDate(userData.subscription.expiresAt)],
        ['Transaction ID', userData.subscription.transactionId]
      ];

      currentY = drawSection('SUBSCRIPTION INFO', subscriptionInfo.filter(([label, value]) => value), currentY);
    }

    // FOOTER
    const footerHeight = 50;
    drawRoundedRect(0, 0, width, footerHeight, primaryRed);
    
    // Footer content
    drawText('Generated by ShivBandhan Matrimonial Services', margin, 30, {
      size: 10, color: white, bold: true
    });
    
    // Generate profile ID from user data
    const profileId = userData._id ? userData._id.toString().slice(-6).toUpperCase() : Date.now().toString().slice(-6);
    drawText(`Profile ID: SB${profileId}`, margin, 15, {
      size: 8, color: rgb(0.9, 0.9, 0.9)
    });
    
    drawText(`Generated on: ${new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    })}`, width - 150, 30, {
      size: 9, color: rgb(0.9, 0.9, 0.9)
    });
    
    drawText('Connecting Hearts, Creating Bonds', width - 150, 15, {
      size: 8, color: rgb(0.8, 0.8, 0.8), italic: true
    });

    // Decorative elements
    // Top decorative border
    for (let i = 0; i < 20; i++) {
      page.drawCircle({
        x: margin + (i * 25),
        y: height - 105,
        size: 2,
        color: accentGold,
      });
    }

    // Side decorative elements
    for (let i = 0; i < 8; i++) {
      page.drawRectangle({
        x: width - 25,
        y: height - 200 - (i * 60),
        width: 15,
        height: 3,
        color: accentGold,
      });
    }

    // Serialize the PDF
    const pdfBytes = await pdfDoc.save();
    const base64Pdf = Buffer.from(pdfBytes).toString('base64');

    // Generate filename
    const name = userData.name || 'Profile';
    const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `ShivBandhan_${sanitizedName}_Biodata.pdf`;

    return NextResponse.json({
      success: true,
      pdf: base64Pdf,
      fileName: fileName,
      message: 'Biodata PDF generated successfully',
      profileId: `SB${profileId}`
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to generate PDF biodata',
        error: error.message 
      },
      { status: 500 }
    );
  }
}