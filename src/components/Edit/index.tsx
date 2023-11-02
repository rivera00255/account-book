import { addDoc, collection } from 'firebase/firestore';
import { Dispatch, SetStateAction, SyntheticEvent, useContext, useRef, useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { Accounts } from '../../type';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addComma, strToUnccoma } from '../../utilities/format';
import { AuthContext } from '../../utilities/AuthProvider';

const Edit = ({ isEdit, setIsEdit }: { isEdit: boolean; setIsEdit: Dispatch<SetStateAction<boolean>> }) => {
  const today = new Date();
  const yearRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);
  const descRef = useRef<HTMLInputElement>(null);

  const [type, setType] = useState('');
  const [amount, setAmount] = useState('');

  const user = useContext(AuthContext);

  const queryClient = useQueryClient();

  const createAccount = async (accounts: Accounts) => {
    try {
      const docRef = await addDoc(collection(db, user.uid ?? 'account'), accounts);
      if (docRef.id) setIsEdit(!isEdit);
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  };

  const { mutate: addLedger } = useMutation({
    mutationFn: createAccount,
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['account'] }),
  });

  const onSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    const uncommaAmount = strToUnccoma(amount);
    if (Number(uncommaAmount) > 0) {
      // const date = new Date(`${yearRef.current?.value}-${monthRef.current?.value}-${dayRef.current?.value}`)
      //   .toLocaleDateString()
      //   .replaceAll('. ', '-')
      //   .replace('.', '');
      const date = new Date(`${yearRef.current?.value}-${monthRef.current?.value}-${dayRef.current?.value}`);
      const description = descRef.current?.value ?? '';
      const userId = auth.currentUser?.uid ?? '';
      addLedger({ date, description, amount: Number(uncommaAmount), accountType: type, userId });
    } else {
      alert('정확한 금액을 입력해주세요.');
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-5">
        <p className="text-gray-500 mb-2">날짜</p>
        <input
          type="number"
          defaultValue={today.getFullYear()}
          ref={yearRef}
          className="border p-2 text-center rounded mr-1"
        />
        <input
          type="number"
          defaultValue={today.getMonth() + 1}
          ref={monthRef}
          className="border p-2 text-center rounded mr-1"
        />
        <input type="number" defaultValue={today.getDate()} ref={dayRef} className="border p-2 text-center rounded" />
      </div>
      <div className="mb-5">
        <p className="text-gray-500 mb-2">내용</p>
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setType('income')}
            data-value={type === 'income' ? type : null}
            className="bg-slate-200 w-49% rounded py-2 data-[value]:bg-slate-300">
            수입
          </button>
          <button
            type="button"
            onClick={() => setType('expense')}
            data-value={type === 'expense' ? type : null}
            className="bg-slate-200 w-49% rounded py-2 data-[value]:bg-slate-300">
            지출
          </button>
        </div>
        <input type="text" ref={descRef} className="border p-2 rounded w-full text-right mt-2" />
      </div>
      <div className="mb-5">
        <p className="text-gray-500 mb-2">금액</p>
        <input
          type="text"
          value={amount}
          onChange={(e) => setAmount(addComma(e.target.value))}
          className="border p-2 rounded w-full text-right"
        />
      </div>
      <div className="flex items-center justify-between mt-4 mb-2">
        <button type="button" className="bg-slate-300 py-2 rounded w-33%">
          닫기
        </button>
        <button className="bg-slate-500 text-white py-2 rounded w-66%">등록하기</button>
      </div>
    </form>
  );
};

export default Edit;
