import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { useRef, useState } from 'react';
import { db } from '../../lib/firebase';
import EditIcon from '../../assets/images/edit.svg';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addComma, strToUnccoma } from '../../utilities/format';

const AmountCard = ({ item }: { item: { [key: string]: any } }) => {
  const [isEdit, setIsEdit] = useState(false);
  const [amount, setAmount] = useState<string>(item.amount);
  const descRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const updateAccount = async ({ id, desc, amount }: { id: string; desc: string; amount: string }) => {
    const account = doc(db, 'account', id);
    await updateDoc(account, { description: desc, amount: amount });
    setIsEdit(false);
  };

  const deleteAccount = async (id: string) => {
    await deleteDoc(doc(db, 'account', id));
    setIsEdit(false);
  };

  const { mutate: updateLedger } = useMutation({
    mutationFn: ({ id, desc, amount }: { id: string; desc: string; amount: string }) =>
      updateAccount({ id, desc, amount }),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['account'] }),
  });

  const { mutate: deleteLedger } = useMutation({
    mutationFn: (id: string) => deleteAccount(id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['account'] }),
  });

  const styledAmount =
    item.accountType === 'income' ? 'text-blue-400' : item.accountType === 'expense' ? 'text-red-400' : '';

  const styledEdit = isEdit ? 'border-b-2' : '';

  return (
    <div className="bg-slate-50 border-dotted border-2 rounded px-10 py-4 mb-1 relative">
      <p className="text-sm text-gray-400 mb-1">{item.date.toDate().toLocaleDateString()}</p>
      <div className="flex justify-between items-center">
        <input
          type="text"
          defaultValue={item.description}
          ref={descRef}
          readOnly={!isEdit}
          className={`bg-slate-50 focus:outline-none ${styledEdit}`}
        />
        <input
          type="text"
          value={!isEdit ? Number(item.amount).toLocaleString() : amount}
          onChange={(e) => setAmount(addComma(e.target.value))}
          readOnly={!isEdit}
          className={`bg-slate-50 text-right focus:outline-none ${styledAmount} ${styledEdit}`}
        />
      </div>
      <div className="absolute top-0 right-3">
        {!isEdit ? (
          <button className="mt-1 opacity-20 hover:opacity-50" onClick={() => setIsEdit(!isEdit)}>
            <img src={EditIcon} alt="icon" width="12px" height="12px" />
          </button>
        ) : (
          <>
            <button
              className="text-xs text-gray-400 mr-2"
              onClick={() => {
                const desc = descRef.current?.value ?? item.description;
                const uncommaAmount = strToUnccoma(amount);
                updateLedger({ id: item.id, desc, amount: uncommaAmount });
              }}>
              수정
            </button>
            <button
              className="text-xs text-gray-400 mr-3"
              onClick={() => {
                if (confirm('정말 삭제하시겠습니까?')) deleteLedger(item.id);
              }}>
              삭제
            </button>
            <button className="text-xs text-gray-400" onClick={() => setIsEdit(!isEdit)}>
              ✕
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AmountCard;
