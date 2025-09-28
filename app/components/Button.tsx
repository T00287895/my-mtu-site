import Link from 'next/link';
import React from 'react';

type ButtonProps = {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
};

const Button = ({ href, onClick, children, disabled, className = '' }: ButtonProps) => {
  const baseClasses = "block w-full bg-gray-100 p-4 text-lg text-black text-center transition-colors cursor-pointer";
  const enabledClasses = "hover:bg-gray-200";
  const disabledClasses = "bg-gray-50 text-gray-400 cursor-not-allowed";

  const combinedClasses = `${baseClasses} ${disabled ? disabledClasses : enabledClasses} ${className}`;

  if (href && !disabled) {
    return (
      <Link href={href} className={combinedClasses}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} disabled={disabled} className={combinedClasses}>
      {children}
    </button>
  );
};

export default Button;
