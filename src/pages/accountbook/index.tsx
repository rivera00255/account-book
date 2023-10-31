import { useMemo, useState } from 'react';
import AddIcon from '../../assets/images/add.png';
import Edit from '../../components/Edit';
import AmountCard from '../../components/AmountCard';
import { signOut } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Query, collection, getDocs, query, where } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';

const AccountBook = () => {
  const [type, setType] = useState('');
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [isEdit, setIsEdit] = useState(false);
  const navigate = useNavigate();

  const getAccount = async (type: string) => {
    if (fetchStatus === 'fetching' && !isFetched && type === '') {
      setIncome(0);
      setExpense(0);
    }
    let list: { [key: string]: any }[] = [];
    let queryResponse: Query | undefined = undefined;
    if (type !== '') {
      queryResponse = query(
        collection(db, 'account'),
        where('accountType', '==', type),
        where('userId', '==', auth.currentUser?.uid)
      );
    } else {
      queryResponse = query(collection(db, 'account'), where('userId', '==', auth.currentUser?.uid));
    }
    const querySnapshot = await getDocs(queryResponse);
    querySnapshot.forEach((doc) => {
      if (!isFetched && type === '') {
        doc.data().accountType === 'income' && setIncome((prev) => prev + Number(doc.data().amount));
        doc.data().accountType === 'expense' && setExpense((prev) => prev + Number(doc.data().amount));
      }
      list.push({ ...doc.data(), id: doc.id });
    });
    return list;
  };

  const { data, fetchStatus, isFetched } = useQuery({ queryKey: ['account', type], queryFn: () => getAccount(type) });
  // console.log(isFetched);

  const accounts = useMemo(() => {
    return data
      ?.sort((prev: { [key: string]: any }, curr: { [key: string]: any }) => {
        return prev.date.toDate().getTime() - curr.date.toDate().getTime();
      })
      .reverse();
  }, [data]);

  return (
    <main className="container mx-auto max-w-960 py-8">
      <div className="bg-slate-50 p-8 rounded">
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
      <div className=" bg-slate-50 p-8 rounded my-3">
        <ul className="flex items-center justify-end font-light">
          <li className="mr-5">
            <button
              data-value={type === '' ? type : null}
              onClick={() => setType('')}
              className="data-[value]:font-medium">
              전체
            </button>
          </li>
          <li className="mr-5">
            <button
              data-value={type === 'income' ? type : null}
              onClick={() => setType('income')}
              className="data-[value]:font-medium">
              수입
            </button>
          </li>
          <li>
            <button
              data-value={type === 'expense' ? type : null}
              onClick={() => setType('expense')}
              className="data-[value]:font-medium">
              지출
            </button>
          </li>
        </ul>
        <hr className="my-4" />
        {accounts && accounts.map((item) => <AmountCard key={item.id} item={item} />)}
      </div>
      <div className="border border-dotted rounded py-8 flex flex-col items-center justify-center">
        {!isEdit ? (
          <>
            <button onClick={() => setIsEdit(true)}>
              <img src={AddIcon} alt="add" width="20px" />
            </button>
            <p className="text-xs mt-2 text-gray-400 font-light">새로운 거래 내역 추가</p>
          </>
        ) : (
          <Edit isEdit={isEdit} setIsEdit={setIsEdit} />
        )}
      </div>
      <button
        onClick={() => {
          signOut(auth);
          navigate('/');
        }}
        className="text-sm my-4 hover:underline">
        로그아웃
      </button>
    </main>
  );
};

export default AccountBook;
