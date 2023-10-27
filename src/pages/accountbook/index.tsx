import { useState } from 'react';
import AddIcon from '../../assets/images/add.png';
import Edit from '../../components/Edit';
import AmountCard from '../../components/AmountCard';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

const AccountBook = () => {
  const [isEdit, setIsEdit] = useState(false);

  return (
    <main className="container mx-auto py-8">
      <div className="max-w-960 mx-auto bg-slate-50 p-8 rounded">
        <div className="flex items-center justify-center mb-4">
          <select className="rounded px-4 py-2 text-sm">
            <option>최근 1개월</option>
            <option>최근 3개월</option>
            <option>전체 내역</option>
          </select>
        </div>
        <div className="flex items-center justify-around">
          <span className="border rounded w-49% px-10 py-4 text-center">
            <p>들어온 돈</p>
            <p>
              <strong className="text-blue-400">0</strong>
            </p>
          </span>
          <span className="border rounded w-49% px-10 py-4 text-center">
            <p>나간 돈</p>
            <p>
              <strong className="text-red-400">0</strong>
            </p>
          </span>
        </div>
      </div>
      <div className="max-w-960 mx-auto bg-slate-50 p-8 rounded my-3">
        <ul className="flex items-center justify-end">
          <li className="mr-5">
            <button className="data-[value]:font-medium">전체</button>
          </li>
          <li className="mr-5">
            <button className="data-[value]:font-medium">수입</button>
          </li>
          <li>
            <button className="data-[value]:font-medium">지출</button>
          </li>
        </ul>
        <hr className="my-4" />
        <AmountCard />
      </div>
      <div className="max-w-960 mx-auto border border-dotted rounded py-8 flex flex-col items-center justify-center">
        {!isEdit ? (
          <>
            <button onClick={() => setIsEdit(true)}>
              <img src={AddIcon} alt="add" width="20px" />
            </button>
            <p className="text-xs mt-2 text-gray-400 font-light">새로운 거래 내역 추가</p>
          </>
        ) : (
          <Edit />
        )}
      </div>
      <button onClick={() => signOut(auth)}>로그아웃</button>
    </main>
  );
};

export default AccountBook;
