



"use client"
import { useState, useEffect } from 'react';
import { useSession } from '@/context/SessionContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, User, MapPin, GraduationCap, Briefcase, Calendar, Star, CheckCircle, Lock, Camera, Clock, Crown, Sparkles, Filter, ArrowUpDown, Bookmark, Eye, MessageCircle, TrendingUp, Users, Navigation, Zap, ChevronDown, SlidersHorizontal, X, Loader2,Search
} from 'lucide-react';
import { Toaster,toast } from 'react-hot-toast';

// Added imports
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { Download } from 'lucide-react';

// Utility function to mask first names
const maskFirstName = (fullName) => {
  if (!fullName) return '****';
  const names = fullName.trim().split(/\s+/);

  if (names.length === 1) {
    // Only one word → hide it all
    return '*'.repeat(names[0].length);
  }

  if (names.length === 2) {
    // Two words → hide first, show last
    return `${'*'.repeat(names[0].length)} ${names[1]}` ;
  }

  // Three or more words → hide first + middle, show last
  const hiddenPart = names
    .slice(0, -1)
    .map(n => '*'.repeat(n.length))
    .join(' ');
  const lastName = names[names.length - 1];
  return `${hiddenPart} ${lastName}` ;
};


// Helper function for case-insensitive city comparison
const isSameCity = (city1, city2) => {
  if (!city1 || !city2) return false;
  return city1.toLowerCase() === city2.toLowerCase();
};

export default function MatchesPage() {
  const { user } = useSession();
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('compatibility');
  const [showQuickFilters, setShowQuickFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [hasSubscription, setHasSubscription] = useState(true);
  const [checkingSubscription, setCheckingSubscription] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  console.log('User data: Matches', user);

    // Quick filter states
  const [quickFilters, setQuickFilters] = useState({
    withPhoto: null,
    verified: null,
    activeRecently: null,
    sameCity: null,
    ageRange: [null, null],
    heightRange: [null, null],
    education: null,
    income: null,
  });

  useEffect(() => {
    const initialize = async () => {
      setIsLoaded(true);
      await checkSubscription();
      await fetchUsers();
    };
    initialize();
  }, [user]);

 

  const checkSubscription = async () => {
    try {
      setCheckingSubscription(true);
       
    // Check subscription status - either isSubscribed is true or subscription hasn't expired
    const isActive = user?.subscription?.isSubscribed || user?.user?.subscription?.isSubscribed;
      // Check subscription status from user session
      setHasSubscription(isActive);
       // If subscription status changed, refetch matches to update blur status
    if (hasSubscription !== isActive) {
      await fetchUsers();
    }
    } catch (err) {
      console.error('Error checking subscription:', err);
       setHasSubscription(false);
    } finally {
      setCheckingSubscription(false);
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return null;
    const birthDate = new Date(dob);
    const ageDiff = Date.now() - birthDate.getTime();
    return Math.floor(ageDiff / (1000 * 60 * 60 * 24 * 365.25));
  };

  const calculateCompatibility = (userProfile, matchProfile) => {
  // List of expectation fields to compare with basic info
  const expectationFields = [
    { expectation: 'expectedCaste', matchField: 'caste' },
    { expectation: 'preferredCity', matchField: 'currentCity' },
    { expectation: 'expectedEducation', matchField: 'education' },
    { expectation: 'expectedHeight', matchField: 'height' },
    { expectation: 'expectedIncome', matchField: 'income' },
    { expectation: 'divorcee', matchField: 'maritalStatus' },
    { expectation: 'expectedAgeDifference', matchField: 'age' },
  ];
   
  const totalFields = expectationFields.length;
  const percentagePerField = 100 / totalFields;
  let matchedPercentage = 0;

  expectationFields.forEach(({ expectation, matchField }) => {
    const expectedValue = userProfile[expectation];
    const matchValue = matchProfile[matchField];
    
    if (!expectedValue || !matchValue) return;

    else if (expectation === 'expectedEducation' && matchField === 'education') {
  // Define education hierarchy (lower index = higher education)
  const educationHierarchy = ['Doctorate', 'Master\'s Degree', 'Bachelor\'s Degree', 'High School'];
  
  const expectedIndex = educationHierarchy.indexOf(expectedValue);
  const matchIndex = educationHierarchy.indexOf(matchValue);
  
  if (expectedIndex !== -1 && matchIndex !== -1) {
    if (matchIndex <= expectedIndex) {
      // Full match - match's education meets or exceeds expectation
      matchedPercentage += percentagePerField;
    } else {
      // Partial match - match's education is lower than expected
      matchedPercentage += percentagePerField / 2;
    }
  }
}
    
    if (expectation === 'expectedAgeDifference') {
  const userAge = calculateAge(userProfile.dob);
  const matchAge = matchProfile.age;
  const ageDiff = Math.abs(userAge - matchAge);
  console 
  
  // No partial matches - either full match or no match
  if (expectedValue === '1' && ageDiff <= 1) {
    matchedPercentage += percentagePerField;
  } 
  else if (expectedValue === '2' && ageDiff <= 2) {
    matchedPercentage += percentagePerField;
  }
  else if (expectedValue === '3' && ageDiff <= 3) {
    matchedPercentage += percentagePerField;
  }
  else if (expectedValue === '5' && ageDiff <= 5) {
    matchedPercentage += percentagePerField;
  }
  else if (expectedValue === '6+' && ageDiff >= 6) {  // Changed to >= for "6 & above"
    matchedPercentage += percentagePerField;
  }
}
else if (expectation === 'expectedHeight' && matchField === 'height') {
  // Extract cm value from strings like:
  // "4'6"(137 cm)", "5'3"(160 cm)", "51"(155cm)-54"(163cm)", etc.
  const extractCm = (str) => {
    const match = str.match(/(\d+)\s*cm/i); // Finds the first number followed by "cm"
    return match ? parseInt(match[1]) : null;
  };

  // Parse expected height range (min and max in cm)
  let expectedMinCm, expectedMaxCm;

  if (expectedValue.includes('–') || expectedValue.includes('-')) { 
    // Case: Range like "4'6"(137 cm) – 5'0"(152 cm)" or "51"(155cm)-54"(163cm)"
    const [rangeStart, rangeEnd] = expectedValue.split(/[–-]/); // Split on hyphen/dash
    expectedMinCm = extractCm(rangeStart);
    expectedMaxCm = extractCm(rangeEnd);
  } 
  else if (expectedValue.includes('& above')) {
    // Case: "65"(196cm) & above" → min = 196cm, no max limit
    expectedMinCm = extractCm(expectedValue);
    expectedMaxCm = Infinity; // Anything >= expectedMinCm is acceptable
  } 
  else {
    // Case: Single value (e.g., "5'2"(157 cm)") → treat as exact match
    expectedMinCm = extractCm(expectedValue);
    expectedMaxCm = expectedMinCm; // Must match exactly
  }

  // Extract user's height in cm (e.g., "5'3"(160 cm)" → 160)
  const userHeightCm = extractCm(matchValue);

  // Strict check: Only increase % if user's height is within or EQUAL to min/max
  if (expectedMinCm !== null && expectedMaxCm !== null && userHeightCm !== null) {
    if (userHeightCm >= expectedMinCm && userHeightCm <= expectedMaxCm) {
      matchedPercentage += percentagePerField; // Full match → increase %
    }
    
  } 
  else {
    console.error("Failed to parse height values:", { expectedValue, matchValue });
  }
}
    else if (expectation === 'expectedIncome' && matchField === 'income') {
      if (expectedValue === matchValue) {
        matchedPercentage += percentagePerField;
      }
    }
    else if (expectation === 'preferredCity' && matchField === 'currentCity') {
      if (isSameCity(expectedValue, matchValue)) {
        matchedPercentage += percentagePerField;
      }
    }
    else if (expectation === 'divorcee' && matchField === 'maritalStatus') {
      if (expectedValue === 'yes' || matchValue === 'Unmarried') {
        matchedPercentage += percentagePerField;
      }
    }
    else if (expectedValue === matchValue) {
      matchedPercentage += percentagePerField;
    }
     if (expectation === 'expectedCaste' && matchField === 'caste') {
      // Split caste and sub-caste (assuming format like "Brahmin-Deshastha")
      const [expectedMainCaste, expectedSubCaste] = expectedValue.split('-');
      const [matchMainCaste, matchSubCaste] = matchValue.split('-');
      
      if (expectedMainCaste === matchMainCaste) {
        if (expectedSubCaste && matchSubCaste && expectedSubCaste === matchSubCaste) {
          // Full match - both main caste and sub-caste match
          matchedPercentage += percentagePerField;
        } else {
          // Partial match - only main caste matches
          matchedPercentage += percentagePerField / 2;
        }
      }
    }
  });

  return Math.min(100, Math.round(matchedPercentage));

};
const fetchSentInterests = async (senderId) => {
  try {
    const res = await fetch(`/api/interest?userId=${senderId}` );
    const data = await res.json();
    if (data.success) {
      return data.interests.map(i => i.receiver.id); // ⬅️ array of IDs where interest was sent
    }
  } catch (err) {
    console.error('Error fetching sent interests:', err);
  }
  return [];
};

  const fetchUsers = async () => {
  try {
    setIsLoading(true);

    const currentUserRes = await fetch('/api/users/me');
    const currentUserData = await currentUserRes.json();

    const sentReceiverIds = await fetchSentInterests(currentUserData._id);

    const res = await fetch('/api/users/fetchAllUsers?limit=20&page=1');
    const data = await res.json();

    if (data.success) {
      const enriched = data.data
        .filter(matchUser =>
          matchUser._id !== currentUserData.id &&
          matchUser.gender !== currentUserData.gender &&
          matchUser.dob && matchUser.height && matchUser.currentCity &&
          matchUser.education && matchUser.income && matchUser.maritalStatus && matchUser.caste
        )
        .map(matchUser => {
          const compatibility = calculateCompatibility(currentUserData, {
            ...matchUser,
            age: calculateAge(matchUser.dob)
          });

          return {
            ...matchUser,
            age: calculateAge(matchUser.dob),
            profilePhoto: matchUser.profilePhoto || 'https://via.placeholder.com/200x250?text=Profile',
            hasPhoto: !!matchUser.profilePhoto,
            isBlurred: !hasSubscription,
            matchType: 'all',
            mutualMatch: false,
            interestSent: sentReceiverIds.includes(matchUser._id),
            shortlisted: false,
            compatibility,
            bio: matchUser.bio || 'Looking for a compatible life partner.',
            isNew: Math.random() > 0.7,
            lastActive: ['Recently', 'Today', '1 day ago', '2 days ago'][Math.floor(Math.random() * 4)]
          };
        });

      setMatches(enriched);
    }
  } catch (err) {
    console.error('Failed to fetch matches:', err);
  } finally {
    setIsLoading(false);
  }
};

console.log("matches = ",matches)
  const tabs = [
    { id: 'all', label: 'All Matches', count: matches.filter(m => m.compatibility > 0).length, icon: Users },
    { id: 'preferred', label: 'Preferred', count: matches.filter(m => m.compatibility >= 70).length, icon: Star },
    { id: 'new', label: 'New', count: matches.filter(m => m.isNew).length, icon: Sparkles },
    { id: 'nearby', label: 'Nearby', count: matches.filter(m => isSameCity(m.currentCity, user?.currentCity)).length, icon: Navigation }
  ];

  const filteredMatches = matches.filter(match => {
    if (match.compatibility <= 0) return false;
    // Always show all matches by default
  let shouldShow = true;
    // Only apply filters if they have values
  if (searchQuery) {
    shouldShow = shouldShow && match.currentCity?.toLowerCase().includes(searchQuery.toLowerCase());
  }

    
    if (activeTab !== 'all') {
      if (activeTab === 'preferred' && match.compatibility < 70) return false;
      if (activeTab === 'new' && !match.isNew) return false;
      if (activeTab === 'nearby' && !isSameCity(match.currentCity, user?.currentCity)) return false;
    }
    // Quick filters - only apply if they have values
  if (quickFilters.withPhoto !== null) {
    shouldShow = shouldShow && (quickFilters.withPhoto === !!match.hasPhoto);
  }
  if (quickFilters.verified !== null) {
    shouldShow = shouldShow && (quickFilters.verified === !!match.isVerified);
  }
  if (quickFilters.activeRecently !== null) {
    shouldShow = shouldShow && (quickFilters.activeRecently !== match.lastActive.includes('day'));
  }
  if (quickFilters.sameCity !== null) {
    shouldShow = shouldShow && (quickFilters.sameCity === isSameCity(match.currentCity, user?.currentCity));
  }
  
  // Age range filter - only apply if both min and max are set
  if (quickFilters.ageRange[0] !== null && quickFilters.ageRange[1] !== null) {
    shouldShow = shouldShow && (match.age >= quickFilters.ageRange[0] && match.age <= quickFilters.ageRange[1]);
  }
  
  // Height range filter - fixed implementation
  if (quickFilters.heightRange[0] && quickFilters.heightRange[1]) {
    const convertHeightToInches = (heightStr) => {
      if (!heightStr) return 0;
      const parts = heightStr.match(/(\d+)'(\d+)"/);
      if (!parts) return 0;
      const feet = parseInt(parts[1]);
      const inches = parseInt(parts[2]);
      return (feet * 12) + inches;
    };
    
    const matchHeightInches = convertHeightToInches(match.height);
    const minHeightInches = convertHeightToInches(quickFilters.heightRange[0]);
    const maxHeightInches = convertHeightToInches(quickFilters.heightRange[1]);
    
    shouldShow = shouldShow && (matchHeightInches >= minHeightInches && matchHeightInches <= maxHeightInches);
  }
 // Education filter
if (quickFilters.education) {
  shouldShow = shouldShow && (match.education === quickFilters.education);
}
// Income filter
  if (quickFilters.income) {
    shouldShow = shouldShow && (match.income === quickFilters.income);
  }
  
  return shouldShow;
  }).sort((a, b) => {
    if (sortBy === 'compatibility') return b.compatibility - a.compatibility;
    if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortBy === 'recently_active') return new Date(b.lastActive) - new Date(a.lastActive);
    if (sortBy === 'age_low') return a.age - b.age;
    if (sortBy === 'age_high') return b.age - a.age;
    return 0;
  });
   
  console.log("fi = ",filteredMatches)

  // Added: PDF download handler
  // Per-profile PDF download
// Per-profile PDF download with persistent unlock for non-subscribed users
// Modern Wedding Biodata PDF Generator with Magazine Style
const handleDownloadProfile = async (profile) => {
  try {
    // Always fetch fresh user to read latest unlock/subscription
    const meRes = await fetch('/api/users/me', { cache: 'no-store' });
    const me = await meRes.json();

    const userId = me?._id || me?.id || me?.user?.id;

    const isSubscribed =
      !!(me?.subscription?.isSubscribed || me?.user?.subscription?.isSubscribed);

    const hasPermanentUnlock =
      !!(me?.downloadAccess?.isUnlocked || me?.user?.downloadAccess?.isUnlocked);

    if (!isSubscribed && !hasPermanentUnlock) {
      if (typeof window === 'undefined' || !window.Razorpay) {
        toast.error('Payment is unavailable right now. Please try again.');
        return;
      }

      const razorpay = new window.Razorpay({
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: 100, // ₹1 in paise
        currency: 'INR',
        name: 'ShivBandhan',
        description: 'Profile PDF Download Unlock',
        handler: async (resp) => {
          try {
            // Persist unlock on the server
            const unlockRes = await fetch('/api/users/unlock-download', {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId,
                razorpay_payment_id: resp?.razorpay_payment_id || 'NA',
              }),
            });

            if (!unlockRes.ok) {
              const err = await unlockRes.json().catch(() => ({}));
              throw new Error(err?.error || 'Failed to persist unlock');
            }

            // Re-enter to generate PDF after unlock
            await handleDownloadProfile(profile);
          } catch (e) {
            console.error('Post-payment unlock failed:', e);
            toast.error('Payment succeeded but unlock failed. Please contact support.');
          }
        },
        theme: { color: '#3399cc' },
      });

      razorpay.on('payment.failed', function () {
        toast.error('Payment failed. Please try again.');
      });

      razorpay.open();
      return;
    }

    // ---------- MAGAZINE-STYLE WEDDING BIODATA PDF GENERATION ----------
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pageMargin = 40;
    const lineHeight = 16;
    const titleSize = 18;
    const sectionTitleSize = 14;
    const labelSize = 11;
    const valueSize = 11;

    const colorPrimary = rgb(0.86, 0.25, 0.35); // rose
    const colorAccent = rgb(0.98, 0.78, 0.38); // amber-like
    const colorTextMuted = rgb(0.5, 0.5, 0.5);
    
    // Enhanced palette for professional layout
    const colorText = rgb(0.12, 0.12, 0.12);
    const colorMuted = rgb(0.55, 0.55, 0.55);
    const cardBg = rgb(0.995, 0.985, 0.985);

    // Taller header for better hierarchy
    const headerHeight = 72;

    let page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    let cursorY = height - pageMargin;

    // Helper functions with maxWidth fix
    const drawText = (text, x, y, size = valueSize, isBold = false, color = colorText, maxWidth = width - x - pageMargin) => {
      page.drawText(text || '-', {
        x, y, size,
        font: isBold ? boldFont : font,
        color,
        maxWidth: maxWidth || undefined,
      });
    };

    const newLine = (mult = 1) => { cursorY -= lineHeight * mult; };
    
    const ensureSpace = (lines = 3) => {
      if (cursorY < pageMargin + lines * lineHeight) {
        page = pdfDoc.addPage();
        cursorY = page.getSize().height - pageMargin;
      }
    };

    // ============ UNIQUE MAGAZINE-STYLE LAYOUT ============
    
    // Full-width colored header with diagonal pattern
    const diagPatternSize = 20;
    for (let x = 0; x < width; x += diagPatternSize) {
      for (let y = height - headerHeight; y < height; y += diagPatternSize) {
        const isDark = ((x + y) / diagPatternSize) % 2 === 0;
        page.drawRectangle({
          x, y, 
          width: diagPatternSize, 
          height: diagPatternSize,
          color: isDark ? rgb(0.82, 0.22, 0.32) : rgb(0.86, 0.25, 0.35),
          opacity: 0.95
        });
      }
    }
    
    // Overlay gradient for depth
    for (let i = 0; i < 10; i++) {
      page.drawRectangle({
        x: 0, y: height - headerHeight, 
        width, height: headerHeight / 10,
        color: rgb(0, 0, 0),
        opacity: 0.02 * (10 - i)
      });
      page.drawLine({
        start: { x: 0, y: height - headerHeight + (i * headerHeight / 10) },
        end: { x: width, y: height - headerHeight + (i * headerHeight / 10) },
        thickness: 0.3,
        color: rgb(1, 1, 1),
        opacity: 0.05
      });
    }

    // Bold brand name with embossed effect
    drawText('ShivBandhan', pageMargin + 2, height - 26, 28, true, rgb(0, 0, 0), 200);
    drawText('ShivBandhan', pageMargin, height - 24, 28, true, rgb(1, 1, 1), 200);
    
    // Tagline with golden accent
    page.drawRectangle({ x: pageMargin, y: height - 50, width: 4, height: 18, color: colorAccent });
    drawText('MATRIMONY PROFILE', pageMargin + 10, height - 47, 10, true, rgb(1, 1, 1), 150);

    cursorY = height - headerHeight - 20;

    // ============ HORIZONTAL PHOTO BANNER ============
    const bannerHeight = 200;
    const photoWidth = 160;
    const infoStartX = pageMargin + photoWidth + 30;
    
    // Photo container with frame effect
    page.drawRectangle({ 
      x: pageMargin - 3, 
      y: cursorY - bannerHeight - 3, 
      width: photoWidth + 6, 
      height: bannerHeight + 6, 
      color: colorAccent 
    });
    
    page.drawRectangle({ 
      x: pageMargin, 
      y: cursorY - bannerHeight, 
      width: photoWidth, 
      height: bannerHeight, 
      color: rgb(0.95, 0.95, 0.95) 
    });

    if (profile?.profilePhoto) {
      try {
        const res = await fetch(profile.profilePhoto, { mode: 'cors' });
        const imgBytes = await res.arrayBuffer();
        const lower = profile.profilePhoto.toLowerCase();
        const img = lower.endsWith('.png') ? await pdfDoc.embedPng(imgBytes) : await pdfDoc.embedJpg(imgBytes);
        const scale = Math.min(photoWidth / img.width, bannerHeight / img.height);
        const drawW = img.width * scale;
        const drawH = img.height * scale;
        const imgX = pageMargin + (photoWidth - drawW) / 2;
        const imgY = cursorY - bannerHeight + (bannerHeight - drawH) / 2;
        page.drawImage(img, { x: imgX, y: imgY, width: drawW, height: drawH });
      } catch (err) {
        drawText('Photo\nUnavailable', pageMargin + 40, cursorY - bannerHeight / 2, 12, true, colorMuted, 100);
      }
    }

    // ============ INFO CARDS NEXT TO PHOTO ============
    const nameDisplay = profile?.name || 'N/A';
    const ageDisplay = profile?.age || '-';
    const heightDisplay = profile?.height || '-';
    const cityDisplay = profile?.currentCity || '-';
    
    let infoY = cursorY - 15;
    
    // Name card with accent
    page.drawRectangle({ 
      x: infoStartX - 5, 
      y: infoY - 28, 
      width: width - infoStartX - pageMargin + 5, 
      height: 32, 
      color: rgb(0.98, 0.96, 0.96) 
    });
    page.drawRectangle({ x: infoStartX - 5, y: infoY - 28, width: 5, height: 32, color: colorPrimary });
    drawText(nameDisplay, infoStartX + 5, infoY - 18, 18, true, colorPrimary, width - infoStartX - pageMargin - 10);
    
    infoY -= 50;

    // Stats grid
    const statBox = (label, value, x, y, color) => {
      page.drawRectangle({ x, y: y - 42, width: 90, height: 45, color: rgb(0.99, 0.97, 0.97) });
      page.drawRectangle({ x, y: y - 42, width: 90, height: 3, color });
      drawText(label, x + 8, y - 15, 8, false, colorMuted, 74);
      drawText(String(value), x + 8, y - 32, 12, true, colorText, 74);
    };

    statBox('Age', `${ageDisplay} years`, infoStartX, infoY, rgb(0.2, 0.6, 0.8));
    statBox('Height', heightDisplay, infoStartX + 100, infoY, rgb(0.8, 0.4, 0.6));
    statBox('City', cityDisplay, infoStartX + 200, infoY, rgb(0.4, 0.7, 0.5));

    infoY -= 60;

    // Quick info pills
    const drawPill = (text, x, y, bgColor) => {
      const textWidth = text.length * 5;
      page.drawRectangle({ 
        x, y: y - 16, 
        width: textWidth + 16, 
        height: 18, 
        color: bgColor 
      });
      drawText(text, x + 8, y - 11, 9, false, rgb(1, 1, 1), textWidth);
      return textWidth + 24;
    };

    let pillX = infoStartX;
    if (profile?.gender) {
      pillX += drawPill(profile.gender, pillX, infoY, rgb(0.5, 0.3, 0.7));
    }
    if (profile?.maritalStatus) {
      pillX += drawPill(profile.maritalStatus, pillX, infoY, rgb(0.3, 0.6, 0.7));
    }
    if (profile?.education) {
      pillX += drawPill(profile.education, pillX, infoY, rgb(0.7, 0.5, 0.3));
    }

    cursorY -= bannerHeight + 40;

    // ============ GRID LAYOUT FOR SECTIONS ============
    const createSection = (title, data, startY, isLeftColumn) => {
      const sectionWidth = (width - 3 * pageMargin) / 2;
      const x = isLeftColumn ? pageMargin : pageMargin + sectionWidth + pageMargin;
      let y = startY;
      
      // Section header with icon bar
      page.drawRectangle({ x, y: y - 35, width: sectionWidth, height: 38, color: rgb(0.97, 0.95, 0.95) });
      page.drawRectangle({ x, y: y - 35, width: 8, height: 38, color: colorAccent });
      drawText(title.toUpperCase(), x + 18, y - 22, 12, true, colorPrimary, sectionWidth - 28);
      
      y -= 48;
      
      // Data rows with alternating background
      data.forEach((item, idx) => {
        if (idx % 2 === 0) {
          page.drawRectangle({ 
            x, y: y - 18, 
            width: sectionWidth, 
            height: 20, 
            color: rgb(0.995, 0.99, 0.99) 
          });
        }
        
        drawText(item.label, x + 10, y - 13, 9, true, colorMuted, 120);
        drawText(String(item.value || '-'), x + 140, y - 13, 9.5, false, colorText, sectionWidth - 150);
        
        y -= 22;
      });
      
      return y - 15;
    };

    // Left column sections
    let leftY = cursorY;
    
    leftY = createSection('Personal Details', [
      { label: 'Gender', value: profile?.gender },
      { label: 'Marital Status', value: profile?.maritalStatus },
      { label: 'Mother Tongue', value: profile?.motherTongue },
      { label: 'Complexion', value: profile?.complexion },
      { label: 'Weight', value: profile?.weight },
      { label: 'Mangal', value: profile?.mangal ? 'Yes' : 'No' }
    ], leftY, true);

    leftY = createSection('Education', [
      { label: 'Highest Degree', value: profile?.education },
      { label: 'Field of Study', value: profile?.fieldOfStudy },
      { label: 'College/University', value: profile?.college }
    ], leftY, true);

    leftY = createSection('Family Background', [
      { label: 'Father', value: profile?.fatherName },
      { label: 'Mother', value: profile?.mother },
      { label: 'Brothers', value: profile?.brothers || 0 },
      { label: 'Sisters', value: profile?.sisters || 0 },
      { label: 'Parent Occupation', value: profile?.parentOccupation }
    ], leftY, true);

    // Right column sections
    let rightY = cursorY;
    
    rightY = createSection('Location', [
      { label: 'Current City', value: profile?.currentCity },
      { label: 'Native City', value: profile?.nativeCity },
      { label: 'Address', value: profile?.permanentAddress }
    ], rightY, false);

    rightY = createSection('Professional', [
      { label: 'Occupation', value: profile?.occupation },
      { label: 'Company', value: profile?.company },
      { label: 'Annual Income', value: profile?.income }
    ], rightY, false);

    rightY = createSection('Religious Details', [
      { label: 'Caste', value: profile?.caste },
      { label: 'Rashi', value: profile?.rashi },
      { label: 'Nakshatra', value: profile?.nakshira },
      { label: 'Gotra/Devak', value: profile?.gotraDevak }
    ], rightY, false);

    // Footer on all pages
    const __pages = pdfDoc.getPages();
    const __total = __pages.length;
    const __dateStr = new Date().toLocaleDateString('en-IN');
    __pages.forEach((p, idx) => {
      const { width: __pw } = p.getSize();
      p.drawLine({ start: { x: pageMargin, y: 28 }, end: { x: __pw - pageMargin, y: 28 }, thickness: 0.5, color: colorTextMuted });
      drawText('Generated by ShivBandhan', pageMargin, 14, 9, false, colorTextMuted, 150, p);
      drawText(`${__dateStr}`, __pw / 2 - 20, 14, 9, false, colorTextMuted, 100, p);
      drawText(`Page ${idx + 1} of ${__total}`, __pw - pageMargin - 80, 14, 9, false, colorTextMuted, 80, p);
    });

    // ============ SAVE AND DOWNLOAD PDF ============
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(profile?.name || 'wedding_biodata').toLowerCase().replace(/\s+/g, '_')}_shivbandhan.pdf`;
    
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success('Wedding Biodata PDF downloaded successfully!');
  } catch (e) {
    console.error('Wedding Biodata PDF generation failed:', e);
    toast.error('Failed to generate wedding biodata PDF');
  }
};

   const handleSendInterest = async (senderId, receiverId) => {
    console.log('Sending interest from', senderId, 'to', receiverId);
    
 // Prevent sending interest to yourself (extra safety)
  if (senderId === receiverId) {
    toast.error("You can't send interest to yourself");
    return;
  }

    const alreadySent = matches.find(m => m._id === receiverId)?.interestSent;
     if (alreadySent) return;
    
    if (!hasSubscription) {
      window.location.href = '/dashboard/subscription';
      return;
    }
  
    try {
      const res = await fetch('/api/interest/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
         senderId,
         receiverId
        }),
      });

      const data = await res.json();
      if (res.ok) {
      // Update UI to show interest was sent
       const updatedMatches = matches.map(match => 
       match._id === receiverId ? { ...match, interestSent: true } : match
       );
       setMatches(updatedMatches);

      console.log('Interest sent successfully:', data);
    } else {
      toast.error(data.message || 'Failed to send interest');
    }
  } catch (error) {
    console.error('Error sending interest:', error);
  }
};

const handleImageClick = (match) => {
  if (!hasSubscription) {
    window.location.href = '/dashboard/subscription';
    return;
  }
  setSelectedProfile(match);
};
  const closeProfilePopup = () => {
    setSelectedProfile(null);
  };
  console.log("USERRRRRR = ",user?.id)

//   // At the beginning of the ProfilePopup component:
// if (!hasSubscription) {
//   return (
//     <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
//       <div className="bg-white rounded-xl p-6 max-w-md text-center">
//         <Lock className="w-12 h-12 mx-auto text-rose-500 mb-4" />
//         <h3 className="text-xl font-bold text-gray-900 mb-2">Premium Feature</h3>
//         <p className="text-gray-600 mb-6">
//           You need a subscription to view full profiles. Upgrade now to see complete details and photos.
//         </p>
//         <button
//           onClick={() => window.location.href = '/dashboard/subscription'}
//           className="bg-rose-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-rose-600 transition-colors"
//         >
//           Upgrade Now
//         </button>
//       </div>
//     </div>
//   );
// }
const ProfilePopup = ({ profile, onClose , hasSubscription }) => {
  const [isImagePopupOpen, setIsImagePopupOpen] = useState(false);

  return (
    <>
      {/* Main Profile Popup */}
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-rose-100 flex flex-col lg:flex-row"
        >
          {/* Fixed Left Side - Profile Image & Quick Stats */}
          <div className="w-full lg:w-1/3 p-4 border-r border-rose-100 bg-gradient-to-b from-rose-50/30 to-amber-50/30 flex flex-col items-center">
            {/* Close button for desktop */}
            

            {/* Header for mobile */}
            <div className="lg:hidden mb-4 text-center">
              <h3 className="text-xl font-bold text-rose-800">Profile Details</h3>
              <p className="text-sm text-rose-600">Compatibility: {profile.compatibility}% Match</p>
            </div>

            {/* Clickable Profile Photo */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsImagePopupOpen(true)}
              className="w-full max-w-[240px] mx-auto mb-4 cursor-pointer"
            >
              <div className="aspect-[3/4] bg-gradient-to-br from-rose-100 to-amber-100 rounded-xl overflow-hidden shadow-lg relative group">
                {profile.profilePhoto ? (
                  <>
                    <img
                      src={profile.profilePhoto}
                      alt={`${maskFirstName(profile.name)} profile` }
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center gap-2">
                    <Camera className="w-12 h-12 text-rose-300" />
                    <span className="text-rose-400 font-medium">Add Profile Photo</span>
                  </div>
                )}
              </div>
            </motion.div>
            
            {/* Quick Stats */}
            <div className="w-full grid grid-cols-2 gap-2 mt-2">
              <div className="bg-rose-50 p-2 rounded-lg text-center">
                <p className="text-xs text-rose-600">Age</p>
                <p className="font-semibold text-rose-800">{profile.age}</p>
              </div>
              <div className="bg-amber-50 p-2 rounded-lg text-center">
                <p className="text-xs text-amber-600">Height</p>
                <p className="font-semibold text-amber-800">{profile.height}</p>
              </div>
              <div className="bg-emerald-50 p-2 rounded-lg text-center">
                <p className="text-xs text-emerald-600">City</p>
                <p className="font-semibold text-emerald-800">{profile.currentCity}</p>
              </div>
              <div className="bg-blue-50 p-2 rounded-lg text-center">
                <p className="text-xs text-blue-600">Weight</p>
                <p className="font-semibold text-blue-800">{profile.weight || '-'}</p>
              </div>
            </div>
          </div>
          
          {/* Scrollable Right Side - Profile Details */}
          <div className="w-full lg:w-2/3 overflow-y-auto flex flex-col">
            {/* Header for desktop */}
            <div className="hidden lg:flex sticky top-0 bg-gradient-to-r from-rose-50 to-amber-50 p-4 border-b border-rose-200 z-10">
              <div>
                <h3 className="text-xl font-bold text-rose-800">Profile Details</h3>
                <p className="text-sm text-rose-600">Compatibility: {profile.compatibility}% Match</p>
              </div>
              <button 
    onClick={onClose}
    className="text-rose-500 hover:text-rose-700 transition-colors p-1 rounded-full hover:bg-rose-100 ml-auto"
  >
    <X className="w-6 h-6" />
  </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {/* Name and Title */}
              <div className="border-b border-rose-100 pb-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                 {hasSubscription ? profile.name : maskFirstName(profile.name)}
                 {profile.isVerified && (
                 <span className="ml-2 inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                 <CheckCircle className="w-3 h-3 mr-1" />
                   Verified
                 </span>
                )}
                </h2>
                <p className="text-rose-600 font-medium">{profile.occupation || 'Professional'}</p>
              </div>
              
              {/* Info Sections */}
              <div className="space-y-5 mt-5">
                {/* About Section */}
                <div className="bg-gradient-to-r from-rose-50/50 to-transparent p-4 rounded-xl">
                  <h3 className="flex items-center text-rose-700 font-semibold mb-2">
                    <User className="w-4 h-4 mr-2" />
                    About
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Gender</p>
                      <p className="font-medium">{profile.gender || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Marital Status</p>
                      <p className="font-medium">{profile.maritalStatus || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Mother Tongue</p>
                      <p className="font-medium">{profile.motherTongue || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Complexion</p>
                      <p className="font-medium">{profile.complexion || '-'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Location Section */}
                <div className="bg-gradient-to-r from-blue-50/50 to-transparent p-4 rounded-xl">
                  <h3 className="flex items-center text-blue-700 font-semibold mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    Location
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Current City</p>
                      <p className="font-medium">{profile.currentCity || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Native City</p>
                      <p className="font-medium">{profile.nativeCity || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Address</p>
                      <p className="font-medium">{profile.permanentAddress || '-'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Education Section */}
                <div className="bg-gradient-to-r from-purple-50/50 to-transparent p-4 rounded-xl">
                  <h3 className="flex items-center text-purple-700 font-semibold mb-2">
                    <GraduationCap className="w-4 h-4 mr-2" />
                    Education
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Highest Degree</p>
                      <p className="font-medium">{profile.education || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Field of Study</p>
                      <p className="font-medium">{profile.fieldOfStudy || '-'}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">College</p>
                      <p className="font-medium">{profile.college || '-'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Professional Section */}
                <div className="bg-gradient-to-r from-emerald-50/50 to-transparent p-4 rounded-xl">
                  <h3 className="flex items-center text-emerald-700 font-semibold mb-2">
                    <Briefcase className="w-4 h-4 mr-2" />
                    Professional
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Occupation</p>
                      <p className="font-medium">{profile.occupation || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Company</p>
                      <p className="font-medium">{profile.company || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Income</p>
                      <p className="font-medium">{profile.income || '-'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Family Section */}
                <div className="bg-gradient-to-r from-amber-50/50 to-transparent p-4 rounded-xl">
                  <h3 className="flex items-center text-amber-700 font-semibold mb-2">
                    <Users className="w-4 h-4 mr-2" />
                    Family
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Father</p>
                      <p className="font-medium">{profile.fatherName || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Mother</p>
                      <p className="font-medium">{profile.mother || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Siblings</p>
                      <p className="font-medium">
                        {profile.brothers || 0} brothers, {profile.sisters || 0} sisters
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Parent Occupation</p>
                      <p className="font-medium">{profile.parentOccupation || '-'}</p>
                    </div>
                  </div>
                </div>
                
                {/* Horoscope Section */}
                <div className="bg-gradient-to-r from-indigo-50/50 to-transparent p-4 rounded-xl">
                  <h3 className="flex items-center text-indigo-700 font-semibold mb-2">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Horoscope
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Rashi</p>
                      <p className="font-medium">{profile.rashi || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Nakshira</p>
                      <p className="font-medium">{profile.nakshira || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Gotra/Devak</p>
                      <p className="font-medium">{profile.gotraDevak || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Mangal</p>
                      <p className="font-medium">{profile.mangal ? 'Yes' : 'No'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Profile Image Popup */}
      <AnimatePresence>
        {isImagePopupOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center p-4 backdrop-blur-lg"
            onClick={() => setIsImagePopupOpen(false)}
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              transition={{ type: 'spring', damping: 20 }}
              className="relative max-w-2xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {profile.profilePhoto ? (
                <img
                  src={profile.profilePhoto}
                  alt={`${maskFirstName(profile.name)} profile` }
                  className="w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                />
              ) : (
                <div className="aspect-[3/4] bg-gradient-to-br from-rose-100 to-amber-100 rounded-lg flex items-center justify-center">
                  <Camera className="w-16 h-16 text-rose-300" />
                </div>
              )}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-rose-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                Shivbandhan Matrimony
              </div>
              <button
                onClick={() => setIsImagePopupOpen(false)}
                className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-md hover:bg-rose-50 transition-colors"
              >
                <X className="w-6 h-6 text-rose-600" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
const MatchCard = ({ match, hasSubscription, setSelectedProfile, onDownloadProfile }) => (
  <div className="bg-white rounded-lg shadow-md border border-gray-100 hover:shadow-lg transition-all duration-300 overflow-hidden group">
    <div className="relative">
      {/* Mutual Match Banner */}
      {match.mutualMatch && (
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-1 px-3 z-10">
          <div className="flex items-center justify-center">
            <Heart className="w-3 h-3 mr-1 fill-current" />
            <span className="text-xs font-medium">It's a Match!</span>
          </div>
        </div>
      )}

      {/* Profile Image */}
     <div className={`aspect-[4/5] bg-gradient-to-br from-rose-50 to-amber-50 flex items-center justify-center relative ${match.mutualMatch ? 'mt-8' : ''}` }>
        {match.profilePhoto ? (
          <>
            <img
              src={match.profilePhoto}
              alt={`${maskFirstName(match.name)} profile` }
              className={`w-full h-full object-cover ` }
            />
            {!hasSubscription && (
              <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center p-4 text-center">
                
                {/* <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = '/dashboard/subscription';
                  }}
                  className="mt-2 bg-white text-rose-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-rose-50 transition-colors"
                >
                  Unlock Now
                </button> */}
              </div>
            )}
          </>
        ) : (
          <div className="text-center">
            <Camera className="w-8 h-8 text-gray-400 mx-auto mb-1" />
            <p className="text-xs text-gray-500">No Photo</p>
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-1 left-1 flex flex-col space-y-1">
          {match.isVerified && (
            <div className="bg-green-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-medium flex items-center">
              <CheckCircle className="w-2.5 h-2.5 mr-0.5" />
              Verified
            </div>
          )}
          {match.subscription?.plan === 'Premium' && (
            <div className="bg-gradient-to-r from-amber-400 to-rose-500 text-white px-1.5 py-0.5 rounded-full text-[10px] font-medium flex items-center">
              <Crown className="w-2.5 h-2.5 mr-0.5" />
              Premium
            </div>
          )}
        </div>

        {/* Compatibility Score */}
        <div className="absolute top-1 right-1 bg-white/90 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
          <div className="flex items-center">
            <Star className={`w-2.5 h-2.5 mr-0.5 
              ${
                match.compatibility >= 90 ? 'text-green-500' :
                match.compatibility >= 70 ? 'text-teal-500' :
                match.compatibility >= 50 ? 'text-yellow-500' :
                'text-rose-500'
              }`} />
            <span className={`text-[10px] font-medium 
              ${
                match.compatibility >= 90 ? 'text-green-700' :
                match.compatibility >= 70 ? 'text-teal-700' :
                match.compatibility >= 50 ? 'text-yellow-700' :
                'text-rose-700'
              }`}>
              {match.compatibility}%
            </span>
          </div>
        </div>
      </div>

      {/* Profile Info */}
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-gray-900 text-sm"> {hasSubscription ? match.name : maskFirstName(match.name)}</h3>
          <div className="flex items-center space-x-1">
            <Clock className="w-2.5 h-2.5 text-gray-400" />
            <span className="text-[10px] text-gray-500">{match.lastActive}</span>
          </div>
        </div>
        
        <div className="space-y-0.5 text-xs text-gray-600 mb-2">
          <div className="flex items-center">
            <Calendar className="w-2.5 h-2.5 mr-1" />
            <span>{match.age} yrs • {match.height}</span>
          </div>
          <div className="flex items-center">
            <MapPin className="w-2.5 h-2.5 mr-1" />
            <span>{match.currentCity}</span>
          </div>
          <div className="flex items-center">
            <GraduationCap className="w-2.5 h-2.5 mr-1" />
            <span className="truncate">{match.education}</span>
          </div>
          <div className="flex items-center">
            <Briefcase className="w-2.5 h-2.5 mr-1" />
            <span className="truncate">{match.income}</span>
          </div>
        </div>

        {/* Action Buttons */}
        
<div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
  {/* View */}
  <button 
    onClick={(e) => {
      e.stopPropagation();
      if (!hasSubscription) {
        window.location.href = '/dashboard/subscription';
        return;
      }
      setSelectedProfile(match);
    }}
    className="w-full bg-gray-100 text-gray-700 py-1.5 px-2 rounded text-xs font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
    aria-label="View profile"
  >
    <Eye className="w-3 h-3 mr-1" />
    <span>View</span>
  </button>

  {/* Chat/Interest */}
  {match.mutualMatch ? (
    <button className="w-full col-span-1 bg-green-50 text-green-600 py-1.5 px-2 rounded text-xs font-medium hover:bg-green-100 transition-colors flex items-center justify-center">
      <MessageCircle className="w-3 h-3 mr-1" />
      <span>Chat</span>
    </button>
  ) : match.interestSent ? (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        handleSendInterest(user?.user?.id, match._id);
      }}
      disabled={match.interestSent}
      className={`w-full col-span-1 py-1.5 px-2 rounded text-xs font-medium flex items-center justify-center ${
        match.interestSent 
          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
          : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
      }`}
      aria-label="Interest sent"
    >
      <Heart className={`w-3 h-3 mr-1 ${match.interestSent ? 'fill-rose-600' : ''}`} />
      <span>{match.interestSent ? 'Interest Sent' : 'Send Interest'}</span>
    </button>
  ) : (
    <button 
      onClick={(e) => {
        e.stopPropagation();
        if (!hasSubscription) {
          window.location.href = '/dashboard/subscription';
          return;
        }
        handleSendInterest(user?.id ? user.id : user.user.id, match._id);
      }}
      disabled={checkingSubscription}
      className={`w-full col-span-1 py-1.5 px-2 rounded text-xs font-medium flex items-center justify-center ${
        checkingSubscription ? 'bg-gray-100 text-gray-500' :
        'bg-rose-50 hover:bg-rose-100 text-rose-600'
      }`}
      aria-label="Send interest"
    >
      {checkingSubscription ? (
        <Loader2 className="w-3 h-3 animate-spin" />
      ) : (
        <>
          <Heart className="w-3 h-3 mr-1" />
          <span>Interest</span>
        </>
      )}
    </button>
  )}

  {/* Download (icon-only) */}
  <button
    onClick={(e) => {
  e.stopPropagation();
  onDownloadProfile && onDownloadProfile(match);
}}
    className="w-full col-span-2 sm:col-span-1 bg-rose-50 text-rose-700 py-1.5 rounded text-xs hover:bg-rose-100 transition-colors flex items-center justify-center"
    title="Download PDF"
    aria-label="Download profile as PDF"
  >
    <Download className="w-4 h-4" />
  </button>
</div>
      </div>
    </div>
  </div>
);

  const EmptyState = ({ isLoading }) => (
    <div className="text-center py-12">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <div className="animate-pulse flex space-x-4 mb-4">
            <div className="rounded-full bg-rose-100 h-12 w-12"></div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Browsing matches...</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Finding the best matches for you
          </p>
        </div>
      ) : (
        <>
          <div className="bg-rose-50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-rose-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches found yet</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Try updating your preferences or keep checking back — someone special may join soon!
          </p>
          <button className="bg-rose-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-rose-600 transition-colors">
            Edit Preferences
          </button>
        </>
      )}
    </div>
  );

  return (
  <div className="min-h-screen bg-gradient-to-br from-rose-50/50 via-white to-amber-50/30">
    <Toaster position="top-right" />
    <div className="max-w-6xl mx-auto p-4 sm:p-6">
      {/* Header Section */}
      <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}` }>
        <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden mb-4 sm:mb-6">
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-white/10 rounded-full blur-2xl"></div>
          <div className="relative z-10">
            <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Your Personalized Matches</h1>
            <p className="text-rose-100 text-sm sm:text-base">Discover profiles selected just for you</p>
          </div>
        </div>
      </div>

      {/* Combined Search and Tabs Section */}
      <div className={`transform transition-all duration-1000 delay-100 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}` }>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 mb-4 sm:mb-6">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by city..."
              className="block w-full pl-10 pr-3 py-2 sm:py-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent text-sm sm:text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Match Type Tabs */}
     <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg border border-rose-100/50 p-1 sm:p-2 w-full max-w-full overflow-hidden">
  <div className="flex overflow-x-auto pb-2 -mx-1 sm:-mx-2 px-1 sm:px-2 hide-scrollbar">
    {tabs.map((tab) => {
      const IconComponent = tab.icon;
      return (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center px-3 py-2 sm:px-4 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0 mx-1 ${
            activeTab === tab.id
              ? 'bg-rose-500 text-white shadow-sm sm:shadow-md'
              : 'text-gray-600 hover:bg-rose-50 hover:text-rose-600'
          }`}
        >
          <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 flex-shrink-0" />
          <span>{tab.label}</span>
          <span className={`ml-1.5 sm:ml-2 px-1.5 py-0.5 rounded-full text-[10px] sm:text-xs flex-shrink-0 ${
            activeTab === tab.id
              ? 'bg-white/20 text-white'
              : 'bg-gray-100 text-gray-600'
          }`}>
            {tab.count}
          </span>
        </button>
      );
    })}
  </div>
</div>

{/* Add this to your global CSS or style tag */}
<style jsx>{`
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`}</style>
        </div>
      </div>

      {/* Quick Filters & Sorting */}
      <div className={`transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}` }>
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md sm:shadow-lg border border-rose-100/50 p-3 sm:p-4 mb-4 sm:mb-6">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4">

            
            
            {/* Quick Filters */}
            <div className="flex-1">
              <button
                onClick={() => setShowQuickFilters(!showQuickFilters)}
                className="flex items-center text-gray-700 hover:text-rose-600 transition-colors text-sm"
              >
                <SlidersHorizontal className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="font-medium">Quick Filters</span>
                <ChevronDown className={`w-3 h-3 sm:w-4 sm:h-4 ml-0.5 sm:ml-1 transition-transform ${showQuickFilters ? 'rotate-180' : ''}` } />
              </button>
              
              {showQuickFilters && (
                <div className="mt-2 sm:mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                  {/* With Photo */}
                  <label className="flex items-center text-xs sm:text-sm">
                    <input
                      type="checkbox"
                      checked={quickFilters.withPhoto === true}
                      onChange={(e) => setQuickFilters(prev => ({ 
                        ...prev, 
                        withPhoto: e.target.checked ? true : null 
                      }))}
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 mr-1 sm:mr-2"
                    />
                    <span>With Photo</span>
                  </label>
                  
                  {/* Verified Only */}
                  <label className="flex items-center text-xs sm:text-sm">
                    <input
                      type="checkbox"
                      checked={quickFilters.verified === true}
                      onChange={(e) => setQuickFilters(prev => ({ 
                        ...prev, 
                        verified: e.target.checked ? true : null 
                      }))}
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 mr-1 sm:mr-2"
                    />
                    <span>Verified Only</span>
                  </label>
                  
                  {/* Active Recently */}
                  <label className="flex items-center text-xs sm:text-sm">
                    <input
                      type="checkbox"
                      checked={quickFilters.activeRecently === true}
                      onChange={(e) => setQuickFilters(prev => ({ 
                        ...prev, 
                        activeRecently: e.target.checked ? true : null 
                      }))}
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 mr-1 sm:mr-2"
                    />
                    <span>Active Recently</span>
                  </label>
                  
                  {/* Same City */}
                  <label className="flex items-center text-xs sm:text-sm">
                    <input
                      type="checkbox"
                      checked={quickFilters.sameCity === true}
                      onChange={(e) => setQuickFilters(prev => ({ 
                        ...prev, 
                        sameCity: e.target.checked ? true : null 
                      }))}
                      className="rounded border-gray-300 text-rose-600 focus:ring-rose-500 mr-1 sm:mr-2"
                    />
                    <span>Same City</span>
                  </label>
                  
                  {/* Age Range */}
                  <div className="col-span-2">
                    <label className="block text-xs sm:text-sm text-gray-600 mb-1">Age Range</label>
                    <div className="flex items-center space-x-2">
                      <select
                        value={quickFilters.ageRange[0] || ''}
                        onChange={(e) => setQuickFilters(prev => ({ 
                          ...prev, 
                          ageRange: [e.target.value ? parseInt(e.target.value) : null, prev.ageRange[1]] 
                        }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs sm:text-sm"
                      >
                        <option value="">Min Age</option>
                        {Array.from({ length: 30 }, (_, i) => 18 + i).map(age => (
                          <option key={age} value={age}>{age}</option>
                        ))}
                      </select>
                      <span className="text-gray-500">to</span>
                      <select
                        value={quickFilters.ageRange[1] || ''}
                        onChange={(e) => setQuickFilters(prev => ({ 
                          ...prev, 
                          ageRange: [prev.ageRange[0], e.target.value ? parseInt(e.target.value) : null] 
                        }))}
                        className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs sm:text-sm"
                      >
                        <option value="">Max Age</option>
                        {Array.from({ length: 30 }, (_, i) => 18 + i).map(age => (
                          <option key={age} value={age}>{age}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  {/* Height Range */}
<div className="col-span-2">
  <label className="block text-xs sm:text-sm text-gray-600 mb-1">Height Range</label>
  <div className="flex items-center space-x-2">
    <select
      value={quickFilters.heightRange[0] || ''}
      onChange={(e) => setQuickFilters(prev => ({ 
        ...prev, 
        heightRange: [e.target.value || null, prev.heightRange[1]] 
      }))}
      className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs sm:text-sm"
    >
      <option value="">Min Height</option>
      {Array.from({ length: 24 }, (_, i) => {
        const feet = Math.floor((54 + i) / 12);
        const inches = (54 + i) % 12;
        const height = `${feet}'${inches}"` ;
        return <option key={height} value={height}>{height}</option>;
      })}
    </select>
    <span className="text-gray-500">to</span>
    <select
      value={quickFilters.heightRange[1] || ''}
      onChange={(e) => setQuickFilters(prev => ({ 
        ...prev, 
        heightRange: [prev.heightRange[0], e.target.value || null] 
      }))}
      className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs sm:text-sm"
    >
      <option value="">Max Height</option>
      {Array.from({ length: 24 }, (_, i) => {
        const feet = Math.floor((54 + i) / 12);
        const inches = (54 + i) % 12;
        const height = `${feet}'${inches}"` ;
        return <option key={height} value={height}>{height}</option>;
      })}
    </select>
  </div>
</div>
                  
{/* Education */}
<div className="col-span-2">
  <label className="block text-xs sm:text-sm text-gray-600 mb-1">Education</label>
  <select
    value={quickFilters.education}
    onChange={(e) => setQuickFilters(prev => ({ ...prev, education: e.target.value }))}
    className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs sm:text-sm"
  >
    <option value="">Any Education</option>
    <option value="High School">High School</option>
    <option value="Bachelor's Degree">Bachelor's Degree</option>
    <option value="Master's Degree">Master's Degree</option>
    <option value="PhD">PhD</option>
    <option value="MBA">MBA</option>
    <option value="Engineering">Engineering</option>
    <option value="Medical">Medical</option>
    <option value="Law">Law</option>
    <option value="Other">Other</option>
  </select>
</div>
{/* Income Filter */}
<div className="col-span-2">
  <label className="block text-xs sm:text-sm text-gray-600 mb-1">Annual Income</label>
  <select
    value={quickFilters.income || ''}
    onChange={(e) => setQuickFilters(prev => ({ 
      ...prev, 
      income: e.target.value || null 
    }))}
    className="w-full px-2 py-1 border border-gray-300 rounded-md text-xs sm:text-sm"
  >
    <option value="">Any Income</option>
    <option value="₹5-10 Lakhs">₹5-10 Lakhs</option>
    <option value="₹10-15 Lakhs">₹10-15 Lakhs</option>
    <option value="₹15-20 Lakhs">₹15-20 Lakhs</option>
    <option value="₹20-25 Lakhs">₹20-25 Lakhs</option>
    <option value="₹25+ Lakhs">₹25+ Lakhs</option>
  </select>
</div>
                 
                  
                </div>
              )}
            </div>

           
          </div>

          {/* Results Count and Clear Filters */}
          <div className="flex items-center justify-between mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
            <div className="flex items-center text-xs sm:text-sm text-gray-600">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
              <span>{filteredMatches.length} matches found</span>
            </div>
            <div className="flex items-center space-x-3">

             
              {(quickFilters.withPhoto !== null || 
                quickFilters.verified !== null || 
                quickFilters.activeRecently !== null || 
                quickFilters.sameCity !== null || 
                quickFilters.ageRange[0] !== null || 
                quickFilters.ageRange[1] !== null || 
                quickFilters.heightRange[0] !== null || 
                quickFilters.heightRange[1] !== null || 
                quickFilters.religion || 
                quickFilters.caste) && (
                <button 
                  onClick={() => {
                    setQuickFilters({
                      withPhoto: null,
                      verified: null,
                      activeRecently: null,
                      sameCity: null,
                      ageRange: [null, null],
                      heightRange: [null, null],
                      religion: '',
                      caste: ''
                    });
                    setSearchQuery('');
                    setActiveTab('all');
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800"
                >
                  Clear Filters
                </button>
              )}
              <div className="flex items-center text-xs sm:text-sm text-rose-600">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-0.5 sm:mr-1" />
                <span>Upgrade to see more</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Match Results */}
      <div className={`transform transition-all duration-1000 delay-400 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}` }>
        {matches.length === 0 ? (
          <EmptyState isLoading={isLoading} />
        ) : (
          <>
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMatches.map((match) => (
                <MatchCard
  key={match._id}
  match={match}
  hasSubscription={hasSubscription}
  setSelectedProfile={setSelectedProfile}
  onDownloadProfile={handleDownloadProfile}
/>
              ))}
            </div>

            {/* Load More Button */}
            {filteredMatches.length > 0 && (
              <div className="text-center mt-6 sm:mt-8">
                <button
                  onClick={() => setIsLoading(true)}
                  disabled={isLoading}
                  className="bg-white border border-rose-300 text-rose-600 px-6 py-2 sm:px-8 sm:py-3 rounded-lg font-medium hover:bg-rose-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
                >
                  {isLoading ? 'Loading...' : 'Load More Matches'}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>

    {/* Profile Popup */}
  {selectedProfile && (
  <ProfilePopup 
    profile={selectedProfile} 
    onClose={closeProfilePopup} 
    hasSubscription={hasSubscription}
  />
)}
  </div>
);
}