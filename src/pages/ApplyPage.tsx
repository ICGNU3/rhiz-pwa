import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, CheckCircle, X, Loader2 } from 'lucide-react';
import { supabase } from '../api/client';
import Button from '../components/Button';
import Card from '../components/Card';

const ApplyPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const isPending = searchParams.get('pending') === 'true';

  // Form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    vertical: 'Founder',
    reason: '',
    referral: '',
    features: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const sendConfirmationEmail = async (name: string, email: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('send-application-email', {
        body: { 
          name, 
          email, 
          type: 'confirmation' 
        }
      });
      
      if (error) {
        console.error('Error sending confirmation email:', error);
      } else {
        console.log('Confirmation email sent successfully:', data);
      }
    } catch (err) {
      console.error('Failed to send confirmation email:', err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Submit application to Supabase
      const { error } = await supabase
        .from('membership_applications')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            organization: formData.organization,
            vertical: formData.vertical,
            reason: formData.reason,
            referral: formData.referral,
            features: formData.features,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      // Send confirmation email
      await sendConfirmationEmail(formData.name, formData.email);

      setSuccess(true);
    } catch (err: any) {
      console.error('Application submission error:', err);
      setError(err.message || 'Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render pending application message
  if (isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-aqua to-lavender flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans font-light">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-3 mb-8">
              <img 
                src="/OuRhizome Dark CRM Background Removed Background Removed.png" 
                alt="Rhiz Logo" 
                className="w-12 h-12"
              />
              <span className="text-3xl font-light text-white">Rhiz</span>
            </Link>
          </div>

          <Card className="p-8 text-center bg-white/90 backdrop-blur-md border border-emerald/50">
            <div className="w-16 h-16 bg-gradient-to-br from-lavender to-emerald rounded-full flex items-center justify-center mx-auto mb-6">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
            
            <h2 className="text-2xl font-light text-gray-900 mb-4">
              Application Pending
            </h2>
            
            <p className="text-gray-600 font-light mb-6">
              Your application is currently under review. We'll notify you once you're approved for the Rhiz alpha.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-lavender/10 to-emerald/10 rounded-lg border border-lavender/20">
                <p className="text-sm text-gray-700 font-light">
                  Only 100 Root Members will shape Rhiz's future. We're carefully reviewing each application to ensure a diverse and engaged community.
                </p>
              </div>

              <Link to="/">
                <Button
                  variant="outline"
                  className="w-full font-light"
                >
                  Return to Home
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Render success message
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-aqua to-lavender flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans font-light">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="flex items-center justify-center space-x-3 mb-8">
              <img 
                src="/OuRhizome Dark CRM Background Removed Background Removed.png" 
                alt="Rhiz Logo" 
                className="w-12 h-12"
              />
              <span className="text-3xl font-light text-white">Rhiz</span>
            </Link>
          </div>

          <Card className="p-8 text-center bg-white/90 backdrop-blur-md border border-emerald/50">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald to-aqua rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-light text-gray-900 mb-4">
              Application Received
            </h2>
            
            <p className="text-gray-600 font-light mb-6">
              Thank you your application is under review. Only 100 Root Members will shape Rhiz's future. 34 spots remaining.
            </p>

            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-emerald/10 to-aqua/10 rounded-lg border border-emerald/20">
                <p className="text-sm text-gray-700 font-light">
                  We've sent a confirmation to your email. We'll be in touch soon about your application status.
                </p>
              </div>

              <Link to="/">
                <Button
                  variant="outline"
                  className="w-full font-light"
                >
                  Return to Home
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-aqua to-lavender py-12 px-4 sm:px-6 lg:px-8 font-sans font-light">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/" className="flex items-center justify-center space-x-3 mb-8">
            <img 
              src="/OuRhizome Dark CRM Background Removed Background Removed.png" 
              alt="Rhiz Logo" 
              className="w-12 h-12"
            />
            <span className="text-3xl font-light text-white">Rhiz</span>
          </Link>
          
          <h1 className="text-4xl font-light text-white mb-4">
            Purpose in mind. People in reach. Movement in motion.
          </h1>
          <p className="text-xl font-light text-white/90 max-w-3xl mx-auto mb-2">
            High-context relationship intelligence for builders who strengthen meaningful connections and grow their circle of trust around what matters most.
          </p>
          <p className="text-lg font-light text-white/80 max-w-2xl mx-auto">
            Coordination infrastructure for the people building what's next.
          </p>
        </div>

        {/* Core Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            'Unknown Contact Discovery',
            'Intelligent Outreach Automation',
            'Purpose-Driven Relationship Structure',
            'Trust & Contribution Tracking'
          ].map((feature, index) => (
            <Card key={index} className="p-6 text-center bg-white/10 backdrop-blur-md border border-emerald/50" hover>
              <div className="w-12 h-12 bg-gradient-to-br from-emerald to-aqua rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-light">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-lg font-light text-white mb-2">
                {feature}
              </h3>
            </Card>
          ))}
        </div>

        {/* Built for Relationship Architects */}
        <Card className="p-8 mb-12 bg-gradient-to-r from-emerald/10 to-lavender/10 backdrop-blur-md border border-emerald/50">
          <h2 className="text-2xl font-light text-center text-white mb-6">
            Built for Relationship Architects
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {[
              'Founders',
              'Non-Profit Leaders',
              'Wealth Managers',
              'Venture Capitalists',
              'Community Builders',
              'Cultural Organizers & Artists',
              'AI Agents & Teams'
            ].map((role, index) => (
              <span 
                key={index}
                className="px-4 py-2 bg-green-500/20 backdrop-blur-sm rounded-full text-white font-light shadow-sm border border-green-400/30"
              >
                {role}
              </span>
            ))}
          </div>
        </Card>

        {/* Application Form */}
        <Card className="p-8 bg-white/90 backdrop-blur-md border border-emerald/50">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-medium text-white">
              Apply for Alpha Access
            </h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-white">Step {step} of 2</span>
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-aqua to-emerald rounded-full transition-all duration-300"
                  style={{ width: `${step * 50}%` }}
                ></div>
              </div>
            </div>
          </div>

          {step === 1 ? (
            <form onSubmit={handleNextStep} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                    Name *
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 font-light focus:ring-2 focus:ring-emerald focus:border-emerald"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email *
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 font-light focus:ring-2 focus:ring-emerald focus:border-emerald"
                  />
                </div>

                <div>
                  <label htmlFor="organization" className="block text-sm font-medium text-white mb-2">
                    Organization / Role *
                  </label>
                  <input
                    id="organization"
                    name="organization"
                    type="text"
                    required
                    value={formData.organization}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 font-light focus:ring-2 focus:ring-emerald focus:border-emerald"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  icon={ArrowRight}
                  className="bg-gradient-to-r from-aqua via-emerald to-lavender text-white font-light"
                >
                  Next
                </Button>
              </div>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 font-light">
                  <div className="flex items-center space-x-2">
                    <X className="w-5 h-5" />
                    <span>{error}</span>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label htmlFor="vertical" className="block text-sm font-medium text-white mb-2">
                    Vertical *
                  </label>
                  <select
                    id="vertical"
                    name="vertical"
                    required
                    value={formData.vertical}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 font-light focus:ring-2 focus:ring-emerald focus:border-emerald"
                  >
                    <option value="Founder">Founder</option>
                    <option value="Non-Profit">Non-Profit</option>
                    <option value="Wealth Manager">Wealth Manager</option>
                    <option value="VC">VC</option>
                    <option value="Community Builder">Community Builder</option>
                    <option value="Artist">Artist</option>
                    <option value="AI Team">AI Team</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="reason" className="block text-sm font-medium text-white mb-2">
                    What goal/s would Rhiz help you complete faster? *
                  </label>
                  <textarea
                    id="reason"
                    name="reason"
                    rows={4}
                    required
                    value={formData.reason}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 font-light focus:ring-2 focus:ring-emerald focus:border-emerald"
                  />
                </div>

                <div>
                  <label htmlFor="features" className="block text-sm font-medium text-white mb-2">
                    Are there any features we haven't thought of that you'd like to have?
                  </label>
                  <textarea
                    id="features"
                    name="features"
                    rows={4}
                    value={formData.features}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 font-light focus:ring-2 focus:ring-emerald focus:border-emerald"
                  />
                </div>

                <div>
                  <label htmlFor="referral" className="block text-sm font-medium text-white mb-2">
                    Referral Code (optional)
                  </label>
                  <input
                    id="referral"
                    name="referral"
                    type="text"
                    value={formData.referral}
                    onChange={handleChange}
                    className="block w-full px-4 py-3 border border-gray-300 rounded-xl bg-white text-gray-900 font-light focus:ring-2 focus:ring-emerald focus:border-emerald"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="font-light"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  loading={loading}
                  className="bg-gradient-to-r from-aqua via-emerald to-lavender text-white font-light"
                >
                  Submit Application
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ApplyPage;