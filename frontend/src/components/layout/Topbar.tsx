import dayjs from 'dayjs';
import 'dayjs/locale/ja';

dayjs.locale('ja');

type Props = {
  title: string;
};

const Topbar = ({ title }: Props) => {
  return (
    <div className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="text-lg font-semibold text-gray-800 tracking-tight">{title}</div>
      <div className="flex items-center gap-2">
        <div className="text-xs text-gray-400 bg-gray-50 border border-gray-200 px-2.5 py-1 rounded font-mono">
          {dayjs().format('YYYY-MM-DD ddd').toUpperCase()}
        </div>
      </div>
    </div>
  );
};

export default Topbar;