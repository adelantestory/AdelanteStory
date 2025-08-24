import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, CreditCard, Building2, Wallet, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface DonationForm {
  amount: string;
  customAmount: string;
  paymentMethod: 'credit-card' | 'paypal' | 'bank-transfer';
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  // Billing address (for credit card only)
  address1: string;
  address2: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  // Optional fields
  isRecurring: boolean;
  frequency: 'monthly' | 'quarterly' | 'annually';
  message: string;
  isAnonymous: boolean;
}

const PRESET_AMOUNTS = ['25', '50', '100', '250', '500', '1000'];

export default function DonatePage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<DonationForm>({
    amount: '',
    customAmount: '',
    paymentMethod: 'credit-card',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'US',
    isRecurring: false,
    frequency: 'monthly',
    message: '',
    isAnonymous: false,
  });

  const [currentStep, setCurrentStep] = useState<'amount' | 'details' | 'payment'>('amount');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleAmountSelection = (amount: string) => {
    setFormData(prev => ({ ...prev, amount, customAmount: '' }));
  };

  const handleCustomAmountChange = (value: string) => {
    setFormData(prev => ({ ...prev, customAmount: value, amount: '' }));
  };

  const handleInputChange = (field: keyof DonationForm, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getDonationAmount = () => {
    return formData.customAmount || formData.amount;
  };

  const validateStep = (step: 'amount' | 'details' | 'payment') => {
    switch (step) {
      case 'amount':
        return getDonationAmount() && parseFloat(getDonationAmount()) > 0;
      case 'details':
        return formData.firstName && formData.lastName && formData.email && formData.phone;
      case 'payment':
        if (formData.paymentMethod === 'credit-card') {
          return formData.address1 && formData.city && formData.state && formData.zipCode;
        }
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (currentStep === 'amount' && validateStep('amount')) {
      setCurrentStep('details');
    } else if (currentStep === 'details' && validateStep('details')) {
      setCurrentStep('payment');
    }
  };

  const handleBack = () => {
    if (currentStep === 'details') {
      setCurrentStep('amount');
    } else if (currentStep === 'payment') {
      setCurrentStep('details');
    }
  };

  const handleSubmitDonation = async () => {
    if (!validateStep('payment')) {
      toast({
        title: "Missing Information",
        description: "Please complete all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      const donationData = {
        ...formData,
        amount: getDonationAmount(),
      };

      // TODO: Implement payment processing based on selected method
      const response = await fetch('/api/donations/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(donationData),
      });

      if (response.ok) {
        toast({
          title: "Thank You!",
          description: "Your donation has been processed successfully.",
        });
        // TODO: Redirect to thank you page
      } else {
        throw new Error('Payment processing failed');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error processing your donation. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          currentStep === 'amount' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          1
        </div>
        <div className="w-16 h-1 bg-gray-200">
          <div className={`h-full transition-all duration-300 ${
            ['details', 'payment'].includes(currentStep) ? 'bg-blue-600 w-full' : 'bg-gray-200 w-0'
          }`} />
        </div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          ['details', 'payment'].includes(currentStep) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          2
        </div>
        <div className="w-16 h-1 bg-gray-200">
          <div className={`h-full transition-all duration-300 ${
            currentStep === 'payment' ? 'bg-blue-600 w-full' : 'bg-gray-200 w-0'
          }`} />
        </div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
          currentStep === 'payment' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
        }`}>
          3
        </div>
      </div>
    </div>
  );

  const renderAmountStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Choose Your Gift Amount</h2>
        <p className="text-gray-600">Every dollar makes a difference in our community</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {PRESET_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => handleAmountSelection(amount)}
            className={`p-4 border-2 rounded-lg text-center transition-all hover:border-blue-500 ${
              formData.amount === amount
                ? 'border-blue-600 bg-blue-50 text-blue-600'
                : 'border-gray-200 hover:border-blue-300'
            }`}
          >
            <span className="text-2xl font-bold">${amount}</span>
          </button>
        ))}
      </div>

      <div className="space-y-2">
        <Label>Or enter a custom amount</Label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
          <Input
            type="number"
            placeholder="0.00"
            value={formData.customAmount}
            onChange={(e) => handleCustomAmountChange(e.target.value)}
            className="pl-8"
            min="1"
            step="0.01"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="recurring"
            checked={formData.isRecurring}
            onCheckedChange={(checked) => handleInputChange('isRecurring', checked)}
          />
          <Label htmlFor="recurring">Make this a recurring donation</Label>
        </div>
        
        {formData.isRecurring && (
          <Select value={formData.frequency} onValueChange={(value) => handleInputChange('frequency', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="annually">Annually</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Your Information</h2>
        <p className="text-gray-600">We need these details to process your donation</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="firstName">First Name *</Label>
          <Input
            id="firstName"
            value={formData.firstName}
            onChange={(e) => handleInputChange('firstName', e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="lastName">Last Name *</Label>
          <Input
            id="lastName"
            value={formData.lastName}
            onChange={(e) => handleInputChange('lastName', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="email">Email Address *</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">Phone Number *</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Optional Message</Label>
        <Textarea
          placeholder="Leave a message of support (optional)"
          value={formData.message}
          onChange={(e) => handleInputChange('message', e.target.value)}
          rows={3}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox 
          id="anonymous"
          checked={formData.isAnonymous}
          onCheckedChange={(checked) => handleInputChange('isAnonymous', checked)}
        />
        <Label htmlFor="anonymous">Make my donation anonymous</Label>
      </div>
    </div>
  );

  const renderPaymentStep = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Payment Method</h2>
        <p className="text-gray-600">Choose how you'd like to complete your ${getDonationAmount()} donation</p>
      </div>

      <RadioGroup 
        value={formData.paymentMethod} 
        onValueChange={(value) => handleInputChange('paymentMethod', value)}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2 p-4 border rounded-lg">
          <RadioGroupItem value="credit-card" id="credit-card" />
          <Label htmlFor="credit-card" className="flex items-center space-x-2">
            <CreditCard className="h-5 w-5" />
            <span>Credit or Debit Card</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-4 border rounded-lg">
          <RadioGroupItem value="paypal" id="paypal" />
          <Label htmlFor="paypal" className="flex items-center space-x-2">
            <Wallet className="h-5 w-5" />
            <span>PayPal</span>
          </Label>
        </div>
        <div className="flex items-center space-x-2 p-4 border rounded-lg">
          <RadioGroupItem value="bank-transfer" id="bank-transfer" />
          <Label htmlFor="bank-transfer" className="flex items-center space-x-2">
            <Building2 className="h-5 w-5" />
            <span>Bank Transfer (ACH)</span>
          </Label>
        </div>
      </RadioGroup>

      {formData.paymentMethod === 'credit-card' && (
        <Card>
          <CardHeader>
            <CardTitle>Billing Address</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="address1">Address Line 1 *</Label>
              <Input
                id="address1"
                value={formData.address1}
                onChange={(e) => handleInputChange('address1', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="address2">Address Line 2</Label>
              <Input
                id="address2"
                value={formData.address2}
                onChange={(e) => handleInputChange('address2', e.target.value)}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  value={formData.zipCode}
                  onChange={(e) => handleInputChange('zipCode', e.target.value)}
                  required
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Select value={formData.country} onValueChange={(value) => handleInputChange('country', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                    <SelectItem value="CA">Canada</SelectItem>
                    <SelectItem value="MX">Mexico</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {formData.paymentMethod === 'paypal' && (
        <Card>
          <CardContent className="p-6 text-center">
            <Wallet className="h-12 w-12 mx-auto text-blue-600 mb-4" />
            <p className="text-gray-600">You'll be redirected to PayPal to complete your donation securely.</p>
          </CardContent>
        </Card>
      )}

      {formData.paymentMethod === 'bank-transfer' && (
        <Card>
          <CardContent className="p-6">
            <Building2 className="h-12 w-12 text-blue-600 mb-4" />
            <p className="text-gray-600 mb-4">
              You'll receive bank transfer instructions after completing this form. 
              Your donation will be processed within 3-5 business days.
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <p className="text-sm text-yellow-700">
                Note: Bank transfers may take 3-5 business days to process. 
                You'll receive a confirmation email with transfer details.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <Heart className="h-12 w-12 text-blue-600" />
              </div>
            </div>
            <CardTitle className="text-3xl">Support Adelante Story Foundation</CardTitle>
            <p className="text-gray-600 mt-2">
              Your generosity helps us empower communities through education and connection
            </p>
          </CardHeader>

          <CardContent>
            {renderStepIndicator()}
            
            {currentStep === 'amount' && renderAmountStep()}
            {currentStep === 'details' && renderDetailsStep()}
            {currentStep === 'payment' && renderPaymentStep()}

            <div className="flex justify-between mt-8 pt-6 border-t">
              {currentStep !== 'amount' && (
                <Button variant="outline" onClick={handleBack}>
                  Back
                </Button>
              )}
              
              <div className="ml-auto">
                {currentStep !== 'payment' ? (
                  <Button 
                    onClick={handleNext}
                    disabled={!validateStep(currentStep)}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button 
                    onClick={handleSubmitDonation}
                    disabled={isProcessing || !validateStep('payment')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isProcessing ? 'Processing...' : `Donate $${getDonationAmount()}`}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}