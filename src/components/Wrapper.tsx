import React from "react";

interface WrapperProps {
  children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return (
    <div className="min-h-screen w-full">
      {children}
    </div>
  );
};

export default Wrapper;