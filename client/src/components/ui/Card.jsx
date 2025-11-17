import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  padding = 'p-6',
  shadow = 'shadow-md',
  hover = false,
  variant = 'default',
  onClick,                 // <-- NEW PROP
}) => {
  const baseClasses = `
    bg-white rounded-2xl border border-gray-200 
    ${shadow} ${padding}
    transition-all duration-300 ease-in-out
  `;
  
  const variantClasses = {
    default: 'hover:border-gray-300',
    featured: 'ring-2 ring-green-500 ring-offset-2 bg-gradient-to-br from-white to-green-50/30',
    gradient: 'bg-gradient-to-br from-white via-blue-50/20 to-purple-50/20 border-transparent'
  };
  
  const hoverClasses = hover 
    ? 'hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-pointer' 
    : '';
    
  const classes = `${baseClasses} ${variantClasses[variant]} ${hoverClasses} ${className}`;
  
  return (
    <div className={classes} onClick={onClick}>
      {children}
    </div>
  );
};

const CardHeader = ({ 
  children, 
  className = '',
  withDivider = false 
}) => (
  <div className={`
    mb-4 
    ${withDivider ? 'pb-4 border-b border-gray-100' : ''} 
    ${className}
  `}>
    {children}
  </div>
);

const CardTitle = ({ 
  children, 
  className = '',
  icon,
  badge 
}) => (
  <div className="flex items-start justify-between gap-3">
    <div className="flex items-center gap-3 flex-1 min-w-0">
      {icon && (
        <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md">
          {icon}
        </div>
      )}
      <h3 className={`text-xl font-bold text-gray-900 truncate ${className}`}>
        {children}
      </h3>
    </div>
    {badge && (
      <div className="flex-shrink-0">
        {badge}
      </div>
    )}
  </div>
);

const CardSubtitle = ({ children, className = '', icon }) => (
  <div className="flex items-center gap-2 mt-2">
    {icon && (
      <span className="text-gray-400 flex-shrink-0">
        {icon}
      </span>
    )}
    <p className={`text-sm text-gray-600 ${className}`}>
      {children}
    </p>
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`space-y-3 ${className}`}>
    {children}
  </div>
);

const CardStats = ({ stats, className = '' }) => (
  <div className={`grid grid-cols-2  gap-3 ${className}`}>
    {stats.map((stat, index) => (
      <div 
        key={index}
        className="flex flex-col items-center p-3 rounded-xl bg-gradient-to-br 
                   from-gray-50 to-gray-100/50 border border-gray-200/50"
      >
        <div className="text-xs text-gray-500 text-center whitespace-nowrap">
          {stat.label}
        </div>

        {stat.icon && (
          <div className="flex items-center gap-2 text-green-600 whitespace-nowrap">
            {stat.icon}
            <span>{stat.value}</span>
          </div>
        )}
      </div>
    ))}
  </div>
);

const CardFeatures = ({ features, className = '' }) => (
  <div className={`flex flex-wrap gap-2 ${className}`}>
    {features.map((feature, index) => (
      <div 
        key={index}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 text-xs font-medium border border-green-200/50 shadow-sm"
      >
        {feature.icon && (
          <span className="text-green-600">
            {feature.icon}
          </span>
        )}
        <span>{feature.label}</span>
      </div>
    ))}
  </div>
);

const CardImage = ({ 
  src, 
  alt = 'Station image', 
  className = '',
  badge 
}) => (
  <div className="relative h-20 overflow-hidden rounded-t-2xl">
    <img 
      src={src} 
      alt={alt}
      className={`w-full h-20 object-cover `}
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    {badge && (
      <div className="absolute top-4 right-4">
        {badge}
      </div>
    )}
  </div>
);

const CardFooter = ({ 
  children, 
  className = '',
  divided = true 
}) => (
  <div className={`
    mt-4 pt-4 
    ${divided ? 'border-t border-gray-100' : ''} 
    ${className}
  `}>
    {children}
  </div>
);

const CardActions = ({ children, className = '' }) => (
  <div className={`flex items-center gap-3 ${className}`}>
    {children}
  </div>
);

const CardBadge = ({ 
  children, 
  variant = 'success', // success, warning, error, info, premium
  className = '' 
}) => {
  const variants = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30',
    warning: 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-lg shadow-yellow-500/30',
    error: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-lg shadow-red-500/30',
    info: 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white shadow-lg shadow-blue-500/30',
    premium: 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30'
  };

  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full 
      text-xs font-bold uppercase tracking-wider
      ${variants[variant]} 
      ${className}
    `}>
      {children}
    </span>
  );
};

const CardRating = ({ rating, count, className = '' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <svg
          key={index}
          className={`w-5 h-5 ${
            index < Math.floor(rating)
              ? 'text-yellow-400 fill-current'
              : index < rating
              ? 'text-yellow-400 fill-current opacity-50'
              : 'text-gray-300 fill-current'
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
    <span className="text-sm font-semibold text-gray-900">{rating.toFixed(1)}</span>
    {count && (
      <span className="text-xs text-gray-500">({count} reviews)</span>
    )}
  </div>
);

const CardPrice = ({ price, unit = '/hour', className = '' }) => (
  <div className={`flex items-baseline gap-1 ${className}`}>
    <span className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
      ₹{price}
    </span>
    <span className="text-sm text-gray-500 font-medium">{unit}</span>
  </div>
);

Card.Header = CardHeader;
Card.Title = CardTitle;
Card.Subtitle = CardSubtitle;
Card.Content = CardContent;
Card.Stats = CardStats;
Card.Features = CardFeatures;
Card.Image = CardImage;
Card.Footer = CardFooter;
Card.Actions = CardActions;
Card.Badge = CardBadge;
Card.Rating = CardRating;
Card.Price = CardPrice;

export default Card;