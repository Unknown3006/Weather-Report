
import React from 'react';
import SignupForm from '@/components/auth/SignupForm';

const Signup = () => {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md">
        <SignupForm />
      </div>
    </div>
  );
};

export default Signup;
