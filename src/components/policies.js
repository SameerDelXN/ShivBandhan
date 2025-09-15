"use client"
import React from 'react';
import { Shield, FileText, CreditCard, Users, Heart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const PolicyLayout = ({ title, children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-amber-50">
      {/* Header */}
  

      {/* Policy Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Link 
            href="/" 
            className="inline-flex items-center text-rose-600 hover:text-rose-700 mb-6 transition-colors"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back to Home
          </Link>
          
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-rose-700 p-6 text-white">
              <h1 className="text-3xl font-serif font-medium">{title}</h1>
              <p className="text-rose-100/90 mt-2">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            
            <div className="p-6 md:p-8 prose prose-lg max-w-none">
              {children}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="w-full bg-rose-900 text-white mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Heart className="text-rose-400" size={24} />
              <span className="text-2xl font-serif font-medium">ShivBandhan</span>
            </div>
            <p className="text-rose-100/80 max-w-2xl mx-auto mb-6">
              Helping you find meaningful connections that last a lifetime. Our thoughtful matchmaking honors tradition while embracing modern relationships.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <Link href="/policies/privacy-policy" className="text-rose-100/80 hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="/policies/terms-of-service" className="text-rose-100/80 hover:text-white transition-colors">Terms of Service</Link>
              <Link href="/policies/refund-policy" className="text-rose-100/80 hover:text-white transition-colors">Refund Policy</Link>
              <Link href="/policies/safety-guidelines" className="text-rose-100/80 hover:text-white transition-colors">Safety Guidelines</Link>
              <Link href="/policies/community-standards" className="text-rose-100/80 hover:text-white transition-colors">Community Standards</Link>
            </div>
            <div className="border-t border-rose-800/50 my-8 mx-auto w-3/4"></div>
            <p className="text-rose-100/60 text-sm">
              © {new Date().getFullYear()} ShivBandhan Matrimony LLP. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Privacy Policy Component
export const PrivacyPolicy = () => {
  return (
    <PolicyLayout title="Privacy Policy">
      <div className="flex items-center mb-6 text-rose-600">
        <Shield size={24} className="mr-2" />
        <h2>Your Privacy Matters</h2>
      </div>
      
      <p className="lead">
        At ShivBandhan Matrimony LLP, we are committed to protecting your privacy and ensuring the security of your personal information.
        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our services.
      </p>
      
      <h3>Information We Collect</h3>
      <p>We collect information that you provide directly to us, including:</p>
      <ul>
        <li>Personal details (name, date of birth, gender, contact information)</li>
        <li>Profile information (education, occupation, family details, preferences)</li>
        <li>Photos and other media you upload to your profile</li>
        <li>Communication preferences and match criteria</li>
        <li>Payment information processed through Razorpay</li>
      </ul>
      
      <h3>How We Use Your Information</h3>
      <p>We use your information to:</p>
      <ul>
        <li>Create and maintain your matrimonial profile</li>
        <li>Provide personalized matchmaking services</li>
        <li>Process payments for premium services</li>
        <li>Communicate with you about matches, updates, and promotions</li>
        <li>Improve our services and develop new features</li>
        <li>Ensure the security and integrity of our platform</li>
      </ul>
      
      <h3>Information Sharing and Disclosure</h3>
      <p>We may share your information with:</p>
      <ul>
        <li>Other registered users as part of our matchmaking services (based on your privacy settings)</li>
        <li>Service providers who assist in our operations (including Razorpay for payment processing)</li>
        <li>Legal authorities when required by law or to protect our rights</li>
      </ul>
      <p>We never sell your personal information to third parties for marketing purposes.</p>
      
      <h3>Data Security</h3>
      <p>
        We implement appropriate technical and organizational measures to protect your personal information
        against unauthorized access, alteration, disclosure, or destruction.
      </p>
      
      <h3>Your Rights</h3>
      <p>You have the right to:</p>
      <ul>
        <li>Access and update your personal information</li>
        <li>Delete your account and personal data</li>
        <li>Opt-out of marketing communications</li>
        <li>Restrict certain uses of your information</li>
      </ul>
      
      <h3>Cookies and Tracking Technologies</h3>
      <p>
        We use cookies and similar technologies to enhance your experience, analyze site usage,
        and deliver personalized content. You can control cookies through your browser settings.
      </p>
      
      <h3>Changes to This Policy</h3>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of any changes by
        posting the new policy on this page and updating the "Last Updated" date.
      </p>
      
      <h3>Contact Us</h3>
      <p>
        If you have any questions about this Privacy Policy, please contact us at:
        <br />
        Email: privacy@shivbandhan.com
        <br />
        Address: Pune, Maharashtra
      </p>
    </PolicyLayout>
  );
};

// Terms of Service Component
export const TermsOfService = () => {
  return (
    <PolicyLayout title="Terms of Service">
      <div className="flex items-center mb-6 text-rose-600">
        <FileText size={24} className="mr-2" />
        <h2>Terms and Conditions</h2>
      </div>
      
      <p className="lead">
        Welcome to ShivBandhan Matrimony LLP. These Terms of Service govern your use of our website
        and services. By accessing or using our services, you agree to be bound by these terms.
      </p>
      
      <h3>Eligibility</h3>
      <p>To use our services, you must:</p>
      <ul>
        <li>Be at least 18 years of age</li>
        <li>Be legally eligible to marry under Indian laws</li>
        <li>Provide accurate and complete information</li>
        <li>Use the service for genuine matrimonial purposes only</li>
      </ul>
      
      <h3>Account Registration</h3>
      <p>
        You are responsible for maintaining the confidentiality of your account credentials
        and for all activities that occur under your account. You agree to notify us immediately
        of any unauthorized use of your account.
      </p>
      
      <h3>User Conduct</h3>
      <p>You agree not to:</p>
      <ul>
        <li>Post false, inaccurate, or misleading information</li>
        <li>Harass, threaten, or abuse other users</li>
        <li>Use the service for any unlawful or fraudulent purpose</li>
        <li>Upload content that is offensive, obscene, or violates others' rights</li>
        <li>Attempt to circumvent our security measures</li>
      </ul>
      
      <h3>Payment Terms</h3>
      <p>
        Certain premium features require payment. All payments are processed through Razorpay,
        our secure payment gateway provider. By making a payment, you agree to Razorpay's terms
        of service in addition to ours.
      </p>
      
      <h3>Intellectual Property</h3>
      <p>
        All content on our platform, including text, graphics, logos, and software, is the property
        of ShivBandhan Matrimony LLP or our licensors and is protected by intellectual property laws.
      </p>
      
      <h3>Termination</h3>
      <p>
        We may suspend or terminate your account at any time if we believe you have violated
        these Terms of Service or applicable laws.
      </p>
      
      <h3>Limitation of Liability</h3>
      <p>
        ShivBandhan Matrimony LLP is not responsible for the actions or representations of users
        on our platform. We provide a venue for introductions but do not guarantee matches or
        marital success.
      </p>
      
      <h3>Governing Law</h3>
      <p>
        These Terms of Service are governed by the laws of India. Any disputes shall be subject
        to the exclusive jurisdiction of the courts in Pune, Maharashtra.
      </p>
      
      <h3>Changes to Terms</h3>
      <p>
        We may modify these terms at any time. Continued use of our services after changes
        constitutes acceptance of the modified terms.
      </p>
    </PolicyLayout>
  );
};

// Refund Policy Component
export const RefundPolicy = () => {
  return (
    <PolicyLayout title="Refund Policy">
      <div className="flex items-center mb-6 text-rose-600">
        <CreditCard size={24} className="mr-2" />
        <h2>Refund and Cancellation Policy</h2>
      </div>
      
      <p className="lead">
        At ShivBandhan Matrimony LLP, we strive to provide excellent service to our members.
        This policy outlines the circumstances under which refunds may be provided for our paid services.
      </p>
      
      <div className="bg-rose-50 p-4 rounded-lg my-6">
        <div className="flex items-start">
          <span className="text-rose-600 mt-1 mr-2 flex-shrink-0">✓</span>
          <span>
            <strong>Note:</strong> All payments on our platform are processed through Razorpay,
            a secure payment gateway that complies with RBI guidelines for online transactions.
          </span>
        </div>
      </div>
      
      <h3>Subscription Services</h3>
      <p>
        We offer various subscription plans with different durations. Once a subscription is activated,
        it is generally non-refundable. However, we may consider refund requests in exceptional circumstances
        at our discretion.
      </p>
      
      <h3>Eligibility for Refund</h3>
      <p>Refund requests may be considered under the following circumstances:</p>
      <ul>
        <li>Technical issues that prevent access to services for an extended period</li>
        <li>Duplicate payment for the same service</li>
        <li>Unauthorized transaction from your account</li>
        <li>Service not delivered as described</li>
      </ul>
      
      <h3>Non-Refundable Services</h3>
      <p>The following services are typically non-refundable:</p>
      <ul>
        <li>Profile highlighting services</li>
        <li>Message credits once used</li>
        <li>Personalized matchmaking services once initiated</li>
        <li>Any service that has been substantially consumed</li>
      </ul>
      
      <h3>Processing Refunds</h3>
      <p>
        Approved refunds will be processed through the original payment method within 7-10 business days.
        For payments made through Razorpay, refunds will be credited to the original source of payment.
      </p>
      
      <h3>How to Request a Refund</h3>
      <p>
        To request a refund, please contact our customer support team at support@shivbandhan.com
        with the following information:
      </p>
      <ul>
        <li>Your registered email address</li>
        <li>Transaction ID (received from Razorpay)</li>
        <li>Date and amount of transaction</li>
        <li>Reason for refund request</li>
      </ul>
      
      <h3>Razorpay Payment Security</h3>
      <p>
        All transactions on our platform are secured by Razorpay, which uses encryption technology
        to protect your payment information. Razorpay is PCI-DSS compliant and follows strict security
        standards to ensure your financial data remains safe.
      </p>
      
      <h3>Dispute Resolution</h3>
      <p>
        If you have any concerns about a transaction, please contact us first. If we are unable to
        resolve the issue, you may contact Razorpay support or your bank for further assistance.
      </p>
      
      <h3>Changes to Refund Policy</h3>
      <p>
        We reserve the right to modify this refund policy at any time. Changes will be effective
        immediately upon posting to our website.
      </p>
    </PolicyLayout>
  );
};

// Safety Guidelines Component
export const SafetyGuidelines = () => {
  return (
    <PolicyLayout title="Safety Guidelines">
      <div className="flex items-center mb-6 text-rose-600">
        <Shield size={24} className="mr-2" />
        <h2>Safety Guidelines</h2>
      </div>
      
      <p className="lead">
        Your safety is our priority at ShivBandhan Matrimony LLP. These guidelines are designed to help
        you have a safe and positive experience while using our platform.
      </p>
      
      <h3>Protecting Your Personal Information</h3>
      <ul>
        <li>Never share financial information with other users</li>
        <li>Use our secure messaging system instead of personal email initially</li>
        <li>Be cautious about sharing personal contact details too quickly</li>
        <li>Keep your password secure and change it regularly</li>
      </ul>
      
      <h3>Safe Meeting Practices</h3>
      <p>When meeting someone in person for the first time:</p>
      <ul>
        <li>Meet in a public place during daylight hours</li>
        <li>Inform a family member or friend about your plans</li>
        <li>Arrange your own transportation</li>
        <li>Keep your phone charged and accessible</li>
        <li>Trust your instincts - if something feels wrong, leave</li>
      </ul>
      
      <h3>Recognizing Red Flags</h3>
      <p>Be cautious if someone:</p>
      <ul>
        <li>Asks for money or financial assistance</li>
        <li>Refuses to video chat or meet in person</li>
        <li>Provides inconsistent information</li>
        <li>Pressures you for personal information</li>
        <li>Seems too good to be true</li>
      </ul>
      
      <h3>Reporting Concerns</h3>
      <p>
        If you encounter suspicious behavior or feel uncomfortable with another user,
        please report it to us immediately. We investigate all reports and take appropriate action,
        which may include removing profiles that violate our guidelines.
      </p>
      
      <h3>Verification Processes</h3>
      <p>
        We employ various verification methods to ensure authentic profiles, including:
      </p>
      <ul>
        <li>Email verification for all new accounts</li>
        <li>Phone number verification for premium members</li>
        <li>Profile screening for suspicious content</li>
        <li>Manual review of selected profiles</li>
      </ul>
      
      <h3>Online Safety Features</h3>
      <p>Our platform includes several safety features:</p>
      <ul>
        <li>Ability to block unwanted users</li>
        <li>Option to report suspicious profiles</li>
        <li>Privacy settings to control visible information</li>
        <li>Secure payment processing through Razorpay</li>
      </ul>
    </PolicyLayout>
  );
};

// Community Standards Component
export const CommunityStandards = () => {
  return (
    <PolicyLayout title="Community Standards">
      <div className="flex items-center mb-6 text-rose-600">
        <Users size={24} className="mr-2" />
        <h2>Community Standards</h2>
      </div>
      
      <p className="lead">
        ShivBandhan Matrimony LLP is built on respect, honesty, and genuine intent.
        These community standards help ensure a positive experience for all our members.
      </p>
      
      <h3>Authentic Representation</h3>
      <ul>
        <li>Provide accurate information about yourself</li>
        <li>Use recent and genuine photos</li>
        <li>Be honest about your intentions and expectations</li>
        <li>Update your profile if your circumstances change</li>
      </ul>
      
      <h3>Respectful Communication</h3>
      <p>When interacting with other members:</p>
      <ul>
        <li>Be polite and respectful in all communications</li>
        <li>Respond to messages in a timely manner</li>
        <li>Respect others' preferences and boundaries</li>
        <li>Accept rejection gracefully</li>
      </ul>
      
      <h3>Prohibited Content</h3>
      <p>Do not post content that:</p>
      <ul>
        <li>Is offensive, abusive, or harassing</li>
        <li>Contains nudity or sexually explicit material</li>
        <li>Promotes illegal activities</li>
        <li>Includes another person's information without consent</li>
        <li>Contains commercial advertisements</li>
      </ul>
      
      <h3>Zero Tolerance Policy</h3>
      <p>
        We have a zero tolerance policy for fraudulent activity, harassment, or any behavior
        that makes other users feel unsafe. Violations may result in immediate account termination.
      </p>
      
      <h3>Cultural Sensitivity</h3>
      <p>
        Our community includes people from diverse backgrounds. We expect all members to
        demonstrate cultural sensitivity and respect for different traditions, beliefs, and practices.
      </p>
      
      <h3>Consequences for Violations</h3>
      <p>
        Depending on the severity of the violation, we may:
      </p>
      <ul>
        <li>Issue a warning</li>
        <li>Restrict certain account features</li>
        <li>Temporarily suspend your account</li>
        <li>Permanently terminate your account</li>
        <li>Report illegal activities to law enforcement</li>
      </ul>
      
      <h3>Appeals Process</h3>
      <p>
        If you believe your account was terminated in error, you may contact us to appeal the decision.
        Please provide any relevant information that supports your case.
      </p>
    </PolicyLayout>
  );
};