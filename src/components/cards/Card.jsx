'use client';

const colorMap = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    icon: 'text-blue-500',
    button: 'bg-blue-500 hover:bg-blue-600',
    border: 'border-blue-200',
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    icon: 'text-green-500',
    button: 'bg-green-500 hover:bg-green-600',
    border: 'border-green-200',
  },
  emerald: {
    bg: 'bg-emerald-100',
    text: 'text-emerald-600',
    icon: 'text-emerald-500',
    button: 'bg-emerald-500 hover:bg-emerald-600',
    border: 'border-emerald-200',
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    icon: 'text-purple-500',
    button: 'bg-purple-500 hover:bg-purple-600',
    border: 'border-purple-200',
  },
  orange: {
    bg: 'bg-orange-100',
    text: 'text-orange-600',
    icon: 'text-orange-500',
    button: 'bg-orange-500 hover:bg-orange-600',
    border: 'border-orange-200',
  },
};

const Card = ({
  title,
  subtitle,
  description,
  icon,
  color = 'blue',
  buttons,
  stats,
  className = '',
}) => {
  const selectedColor = colorMap[color] || colorMap.blue;

  return (
    <div
      className={`rounded-xl overflow-hidden shadow-2xl transition-all duration-300 hover:shadow-xl bg-white ${className}`}
    >
      <div className={`p-6 border-t-4 ${selectedColor.border}`}>
        <div className="flex items-center justify-between mb-4">
          <h2 className={`text-xl font-bold ${selectedColor.text}`}>{title}</h2>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedColor.bg}`}>
            {icon || <span className={`text-xl ${selectedColor.icon}`}>📊</span>}
          </div>
        </div>

        <p className="text-gray-600 mb-2 font-medium">{subtitle}</p>
        {description && <p className="text-gray-500 mb-6 text-sm">{description}</p>}

        <div className="space-y-3">
          {buttons &&
            buttons.map((button, index) => (
              <button
                key={index}
                onClick={button.onClick}
                className={`w-full py-3 text-white rounded-lg flex items-center justify-center space-x-2 transition-colors duration-200 ${selectedColor.button}`}
              >
                {button.icon && <span>{button.icon}</span>}
                <span>{button.text}</span>
              </button>
            ))}
        </div>

        {stats && (
          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex justify-between">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;