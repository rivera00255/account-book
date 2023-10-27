const AmountCard = () => {
  return (
    <div className="bg-slate-50 border-dotted border-2 rounded px-10 py-4 mb-1">
      <p className="text-sm text-gray-500">date</p>
      <div className="flex justify-between items-center">
        <input type="text" defaultValue={'내용'} readOnly className="bg-slate-50 focus:outline-none" />
        <input type="text" defaultValue={'금액'} readOnly className="bg-slate-50 text-right focus:outline-none" />
      </div>
    </div>
  );
};

export default AmountCard;
