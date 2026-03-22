type Props = {
  label: string;
  value: string | number;
  sub?: string;
  subColor?: 'green' | 'red' | 'gray';
};

const StatCard = ({ label, value, sub, subColor = 'gray' }: Props) => {
  const subColors = {
    green: 'text-green-600',
    red:   'text-red-500',
    gray:  'text-gray-400',
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
        {label}
      </div>
      <div className="font-mono text-2xl font-semibold text-gray-800 leading-none">
        {value}
      </div>
      {sub && (
        <div className={`text-xs mt-1.5 ${subColors[subColor]}`}>
          {sub}
        </div>
      )}
    </div>
  );
};

export default StatCard;