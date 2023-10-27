const Edit = () => {
  return (
    <form>
      <div className="mb-5">
        <p className="text-gray-500 mb-2">날짜</p>
        <input type="number" className="border p-2 text-center rounded mr-1" />
        <input type="number" className="border p-2 text-center rounded mr-1" />
        <input type="number" className="border p-2 text-center rounded" />
      </div>
      <div className="mb-5">
        <p className="text-gray-500 mb-2">내용</p>
        <div className="flex items-center justify-between">
          <button className="bg-slate-200 w-49% rounded py-2">수입</button>
          <button className="bg-slate-200 w-49% rounded py-2">지출</button>
        </div>
        <input type="text" className="border p-2 rounded w-full mt-2" />
      </div>
      <div className="mb-5">
        <p className="text-gray-500 mb-2">금액</p>
        <input type="text" className="border p-2 rounded w-full text-right" />
      </div>
      <div className="flex items-center justify-between mt-4 mb-2">
        <button className="bg-slate-300 py-2 rounded w-33%">닫기</button>
        <button className="bg-slate-500 text-white py-2 rounded w-66%">등록하기</button>
      </div>
    </form>
  );
};

export default Edit;
