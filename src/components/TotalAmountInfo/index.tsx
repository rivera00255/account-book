import { Dispatch, SetStateAction } from 'react';

const TotalAmountInfo = ({
  income,
  expense,
  setPeriod,
}: {
  income: number;
  expense: number;
  setPeriod: Dispatch<SetStateAction<number>>;
}) => {
  return (
    <div className="bg-slate-50 p-8 rounded">
      <div className="flex items-center justify-center mb-4">
        <select className="rounded px-4 py-2 text-sm" onChange={(e) => setPeriod(Number(e.target.value))}>
          <option value="30">최근 1개월</option>
          <option value="90">최근 3개월</option>
          <option value="0">전체 내역</option>
        </select>
      </div>
      <div className="flex items-center justify-around">
        <span className="border rounded w-49% px-10 py-4 text-center">
          <p>들어온 돈</p>
          <p>
            <strong className="text-blue-400">{income.toLocaleString()}</strong>
          </p>
        </span>
        <span className="border rounded w-49% px-10 py-4 text-center">
          <p>나간 돈</p>
          <p>
            <strong className="text-red-400">{expense.toLocaleString()}</strong>
          </p>
        </span>
      </div>
    </div>
  );
};

export default TotalAmountInfo;
