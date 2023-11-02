import { useContext, useMemo, useState } from 'react';
import AddIcon from '../../assets/images/add.png';
import Edit from '../../components/Edit';
import AmountCard from '../../components/AmountCard';
import { db } from '../../lib/firebase';
import { Query, collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import TotalAmountInfo from '../../components/TotalAmountInfo';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../utilities/AuthProvider';

const AccountBook = () => {
  const [period, setPeriod] = useState(30);
  const [type, setType] = useState('');
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [isEdit, setIsEdit] = useState(false);

  const user = useContext(AuthContext);
  const navigate = useNavigate();

  const calcStartTime = (period: number) => {
    if (period === 0) return;
    let start = new Date().getTime();
    if (period === 30) start -= 1000 * 60 * 60 * 24 * 30;
    if (period === 90) start -= 1000 * 60 * 60 * 24 * 90;
    return start;
  };

  const calcTotalAmount = (item: { [key: string]: any }) => {
    item.accountType === 'income' && setIncome((prev) => prev + Number(item.amount));
    item.accountType === 'expense' && setExpense((prev) => prev + Number(item.amount));
  };

  const getAccount = async (uid: string | null, type: string | undefined, period: number) => {
    if (fetchStatus === 'fetching' && !isFetched) {
      setIncome(0);
      setExpense(0);
    }
    let list: { [key: string]: any }[] = [];
    let queryResponse: Query | undefined = undefined;
    const startTime = calcStartTime(period);
    if (startTime) {
      queryResponse = query(
        collection(db, uid ?? 'account'),
        where('date', '>=', new Date(startTime)),
        orderBy('date', 'desc')
      );
    } else {
      queryResponse = query(collection(db, uid ?? 'account'), orderBy('date', 'desc'));
    }
    const querySnapshot = await getDocs(queryResponse);
    querySnapshot.forEach((doc) => {
      if (type === '') {
        list.push({ ...doc.data(), id: doc.id });
      } else {
        doc.data().accountType === type && list.push({ ...doc.data(), id: doc.id });
      }
      if (!isFetched) calcTotalAmount(doc.data());
    });
    if (isFetched) {
      setIncome(0);
      setExpense(0);
      startTime
        ? list.forEach((item) => item.date.toDate().getTime() >= startTime && calcTotalAmount(item))
        : list.forEach((item) => calcTotalAmount(item));
    }
    return list;
  };

  const { data, fetchStatus, isFetched } = useQuery({
    queryKey: ['account', user.uid, type, period],
    queryFn: () => getAccount(user.uid, type, period),
  });
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
      <TotalAmountInfo income={income} expense={expense} setPeriod={setPeriod} />
      <div className=" bg-slate-50 p-8 rounded my-3">
        <ul className="flex items-center justify-end font-light">
          <li className="mr-5">
            <button
              data-value={type === '' ? '' : null}
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
      {/* <button
        onClick={() => {
          signOut(auth);
          sessionStorage.removeItem('uid');
          navigate('/');
        }}
        className="text-sm text-gray-500 hover:underline">
        로그아웃
      </button> */}
    </main>
  );
};

export default AccountBook;
