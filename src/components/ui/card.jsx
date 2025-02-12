import React from 'react';

export const Card = ({className = '', children, ...props}) => (
    <div
        className={`bg-white rounded-lg border border-gray-200 shadow-md ${className}`}
        {...props}
    >
        {children}
    </div>
);

export const CardHeader = ({className = '', children, ...props}) => (
    <div
        className={`px-6 py-4 border-b border-gray-200 ${className}`}
        {...props}
    >
        {children}
    </div>
);

export const CardTitle = ({className = '', children, ...props}) => (
    <h3
        className={`text-xl font-bold text-gray-800 ${className}`}
        {...props}
    >
        {children}
    </h3>
);

export const CardContent = ({className = '', children, ...props}) => (
    <div
        className={`p-6 ${className}`}
        {...props}
    >
        {children}
    </div>
);

export const CardFooter = ({className = '', children, ...props}) => (
    <div
        className={`px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg ${className}`}
        {...props}
    >
        {children}
    </div>
);


