import React, { useState } from 'react';

const Tabs = ({ 
  children, 
  defaultActiveTab = 0, 
  className = '',
  variant = 'default' 
}) => {
  const [activeTab, setActiveTab] = useState(defaultActiveTab);

  const tabVariants = {
    default: {
      tabBase: 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
      activeTab: 'text-blue-600 border-blue-500 bg-blue-50',
      tabContainer: 'border-b border-gray-200'
    },
    pills: {
      tabBase: 'text-gray-600 hover:bg-gray-100 rounded-lg',
      activeTab: 'text-white bg-blue-600',
      tabContainer: ''
    },
    underline: {
      tabBase: 'text-gray-500 hover:text-gray-900 border-transparent',
      activeTab: 'text-blue-600 border-blue-500',
      tabContainer: 'border-b border-gray-200'
    }
  };

  const { tabBase, activeTab: activeTabStyle, tabContainer } = tabVariants[variant];

  const tabChildren = React.Children.map(children, (child, index) => 
    React.cloneElement(child, { 
      isActive: index === activeTab,
      onClick: () => setActiveTab(index),
      tabBase,
      activeTabStyle
    })
  );

  return (
    <div className={`${className}`}>
      <div className={`flex space-x-2 ${tabContainer}`}>
        {tabChildren.map((child, index) => 
          React.cloneElement(child, { key: index })
        )}
      </div>
      
      {tabChildren[activeTab]?.props.children}
    </div>
  );
};

const Tab = ({ 
  label, 
  children, 
  isActive = false, 
  onClick, 
  tabBase = '', 
  activeTabStyle = '' 
}) => {
  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        className={`
          px-4 py-2 
          text-sm font-medium 
          focus:outline-none 
          transition-all duration-300
          border-b-2
          ${tabBase}
          ${isActive ? activeTabStyle : ''}
        `}
      >
        {label}
      </button>
    </div>
  );
};

const TabPanel = ({ children, isActive }) => {
  if (!isActive) return null;
  return <div className="mt-4">{children}</div>;
};

Tabs.Tab = Tab;
Tabs.Panel = TabPanel;

export default Tabs;

