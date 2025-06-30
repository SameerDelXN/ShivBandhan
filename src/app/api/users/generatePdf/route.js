import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export async function POST(request) {
  try {
    const { userData } = await request.json();

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const page = pdfDoc.addPage([595, 842]); // A4 size
    const { width, height } = page.getSize();
    const margin = 50;
    const contentWidth = width - 2 * margin;

    const primaryRed = rgb(0.8, 0.2, 0.2);
    const darkText = rgb(0.1, 0.1, 0.1);
    const lightText = rgb(0.4, 0.4, 0.4);
    const borderGray = rgb(0.85, 0.85, 0.85);

    const sanitizeText = (text) => {
      if (!text) return '';
      return text.toString().replace(/₹/g, 'Rs.').replace(/[^\x00-\x7F]/g, '');
    };

    const drawText = (text, x, y, options = {}) => {
      const fontSize = options.size || 11;
      const font = options.bold ? boldFont : regularFont;
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
      const d = new Date(date);
      return d.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    };

    const calculateAge = (dob) => {
      if (!dob) return '';
      const birthDate = new Date(dob);
      const ageDiff = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDiff);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    };

    let currentY = height - margin;

    // HEADER
    drawText('ShivBandhan Matrimonial Profile', margin, currentY, {
      size: 16, bold: true, color: primaryRed
    });
    const profileId = userData._id ? userData._id.toString().slice(-6).toUpperCase() : Date.now().toString().slice(-6);
    drawText(`Profile ID: SB-${profileId}`, margin, currentY - 18, {
      size: 10, color: lightText
    });
    currentY -= 30;
    page.drawLine({
      start: { x: margin, y: currentY },
      end: { x: width - margin, y: currentY },
      thickness: 1,
      color: borderGray
    });
    currentY -= 20;

    // Draw formal section
    const drawFormalSection = (title, data) => {
      if (data.filter(([_, value]) => value).length === 0) return currentY;

      drawText(title.toUpperCase(), margin, currentY, {
        size: 12, bold: true, color: primaryRed
      });
      currentY -= 12;

      page.drawLine({
        start: { x: margin, y: currentY },
        end: { x: width - margin, y: currentY },
        thickness: 0.5,
        color: borderGray
      });
      currentY -= 10;

      for (const [label, value] of data) {
        if (!value && value !== 0 && value !== false) continue;
        const display = typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value;
        drawText(`${label}:`, margin, currentY, {
          size: 10, bold: true
        });
        drawText(sanitizeText(display.toString()), margin + 120, currentY, {
          size: 10
        });
        currentY -= 16;
      }

      currentY -= 10;
    };

    // Sections
    drawFormalSection('Personal Information', [
      ['Full Name', userData.name],
      ['Date of Birth', formatDate(userData.dob)],
      ['Age', calculateAge(userData.dob) + ' years'],
      ['Gender', userData.gender],
      ['Height', userData.height],
      ['Weight', userData.weight + ' kg'],
      ['Complexion', userData.complexion],
      ['Blood Group', userData.bloodGroup],
      ['Wears Lenses', userData.wearsLens],
      ['Marital Status', userData.maritalStatus],
      ['Mother Tongue', userData.motherTongue],
      ['Phone', userData.phone],
      ['Email', userData.email],
      ['Current City', userData.currentCity],
      ['Permanent Address', userData.permanentAddress],
      ['Birth Place', userData.birthPlace],
      ['Birth Time', userData.birthTime]
    ]);

    drawFormalSection('Professional Details', [
      ['Education', userData.education],
      ['Field of Study', userData.fieldOfStudy],
      ['Institution', userData.college],
      ['Occupation', userData.occupation],
      ['Company', userData.company],
      ['Annual Income', userData.income]
    ]);

    drawFormalSection('Family Background', [
      ['Father\'s Name', userData.fatherName],
      ['Mother\'s Name', userData.mother],
      ['Parent Occupation', userData.parentOccupation],
      ['Parent Residence', userData.parentResidenceCity],
      ['Brothers', userData.brothers],
      ['Married Brothers', userData.marriedBrothers],
      ['Sisters', userData.sisters],
      ['Married Sisters', userData.marriedSisters],
      ['Native District', userData.nativeDistrict],
      ['Native City', userData.nativeCity],
      ['Family Wealth', userData.familyWealth],
      ['Relative Surnames', userData.relativeSurname?.join(', ')],
      ['Mama Surname', userData.mamaSurname]
    ]);

    drawFormalSection('Religious Details', [
      ['Religion', userData.religion],
      ['Caste', userData.caste],
      ['Sub Caste', userData.subCaste],
      ['Gothra', userData.gothra],
      ['Gotra/Devak', userData.gotraDevak]
    ]);

    drawFormalSection('Horoscope Details', [
      ['Rashi', userData.rashi],
      ['Nakshatra', userData.nakshira],
      ['Charan', userData.charan],
      ['Gan', userData.gan],
      ['Nadi', userData.nadi],
      ['Mangal', userData.mangal]
    ]);

    drawFormalSection('Partner Expectations', [
      ['Expected Age Difference', userData.expectedAgeDifference],
      ['Expected Education', userData.expectedEducation],
      ['Expected Height', userData.expectedHeight],
      ['Expected Income', userData.expectedIncome],
      ['Preferred City', userData.preferredCity],
      ['Expected Caste', userData.expectedCaste],
      ['Accept Divorcee', userData.divorcee]
    ]);

    drawFormalSection('Account Details', [
      ['Member Since', formatDate(userData.createdAt)],
      ['Last Updated', formatDate(userData.updatedAt)],
      ['Last Login', formatDate(userData.lastLoginAt)],
      ['Phone Verified', userData.phoneIsVerified],
      ['Account Verified', userData.isVerified],
      ['Verification Status', userData.verificationStatus]
    ]);

    // Footer
    currentY = Math.max(currentY, 60);
    page.drawLine({
      start: { x: margin, y: currentY },
      end: { x: width - margin, y: currentY },
      thickness: 0.5,
      color: borderGray
    });
    drawText('ShivBandhan Matrimonial Services', margin, currentY - 15, {
      size: 10, bold: true, color: primaryRed
    });
    drawText('Durga Prasad Apartments, Sinhagad Road, Pune 411051', margin, currentY - 30, {
      size: 9, color: darkText
    });
    drawText('Mobile: +91-8888438693 | Email: support@shivbandhan.com', margin, currentY - 45, {
      size: 8, color: lightText
    });
    drawText(`Generated on ${new Date().toLocaleDateString('en-IN')}`, width - margin - 120, currentY - 45, {
      size: 8, color: lightText
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
