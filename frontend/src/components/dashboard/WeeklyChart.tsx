import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ValueType, NameType } from 'recharts/types/component/DefaultTooltipContent';
import dayjs from 'dayjs';
import 'dayjs/locale/ja';

dayjs.locale('ja');

type Props = {
  data: { date: string; minutes: number }[];
  period: 'week' | 'month';
  onChangePeriod: (period: 'week' | 'month') => void;
};

const WeeklyChart = ({ data, period, onChangePeriod }: Props) => {
  const today = dayjs().format('YYYY-MM-DD');
  const formatTooltipValue = (value: ValueType | undefined, _name: NameType | undefined) => {
    const rawMinutes = Array.isArray(value) ? value[0] : value;
    const minutes = typeof rawMinutes === 'number' ? rawMinutes : Number(rawMinutes) || 0;

    return [`${Math.floor(minutes / 60)}h ${minutes % 60}m`, '活動時間'] as const;
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 px-4 py-3">
        <div className="text-sm font-semibold text-gray-800">
          {period === 'week' ? '週次' : '月次'} 活動時間
        </div>
        <div className="flex bg-gray-100 border border-gray-200 rounded p-0.5 gap-0.5">
          {(['week', 'month'] as const).map((p) => (
            <button
              key={p}
              onClick={() => onChangePeriod(p)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                period === p
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {p === 'week' ? '週' : '月'}
            </button>
          ))}
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 mb-3">※ 開始日基準 / 日曜始まり</p>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={data} barCategoryGap="20%">
            <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip
              formatter={formatTooltipValue}
              labelStyle={{ fontSize: 11 }}
              contentStyle={{ fontSize: 11, borderRadius: 4 }}
            />
            <Bar dataKey="minutes" radius={[3, 3, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.date}
                  fill={entry.date === today ? '#0052CC' : '#DEEBFF'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyChart;
