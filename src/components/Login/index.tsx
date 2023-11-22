import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { useRef, useState } from 'react';
import { auth } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState('signin');
  const [errorMessage, setErrorMessage] = useState({
    email: '',
    password: '',
  });

  const navigate = useNavigate();

  const validateEmail = (value: string) => {
    if (value !== '') {
      const emailRegex = /^\S+@\S+\.\S+$/;
      if (emailRegex.test(value)) {
        setErrorMessage((prev) => ({ ...prev, email: '' }));
        return true;
      }
    }
    setErrorMessage((prev) => ({ ...prev, email: '올바른 이메일 주소를 입력하세요.' }));
    return false;
  };

  const validatePassword = (value: string) => {
    if (value !== '') {
      const passwordRegex = /^(?=.*[a-z])(?=.*[0-9]).{6,20}$/; // 영어 소문자, 숫자 포함 6자리 이상 20자리 이하
      if (passwordRegex.test(value)) {
        setErrorMessage((prev) => ({ ...prev, password: '' }));
        return true;
      }
    }
    setErrorMessage((prev) => ({ ...prev, password: '영어 소문자, 숫자 포함 6자리 이상 20자리 이하로 입력하세요.' }));
    return false;
  };

  const signUpUser = (email: string, password: string) => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        userCredential && alert('회원가입이 완료되었습니다. 로그인 후 이용해주세요.');
      })
      .catch((error) => {
        console.log(error.code);
      });
  };

  const signInUser = (email: string, password: string) => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        userCredential && navigate('/accountbook');
      })
      .catch((error) => {
        alert(error.message);
        console.log(error.code);
      });
  };

  const onSubmit = (email: string, password: string) => {
    if (validateEmail(email) && validatePassword(password)) {
      selected === 'signin' && signInUser(email, password);
      selected === 'signup' && signUpUser(email, password);
    }
  };

  return (
    <div className="w-480 bg-slate-100 rounded flex flex-col items-center px-8 py-10 mx-auto mt-10">
      <div className="flex items-center justify-center mb-3">
        <button
          data-select={selected === 'signin' ? selected : null}
          className="px-2 py-1 mx-1 rounded data-[select]:bg-slate-500 data-[select]:text-white"
          onClick={() => setSelected('signin')}>
          로그인
        </button>
        <button
          data-select={selected === 'signup' ? selected : null}
          className="px-2 py-1 mx-1 rounded data-[select]:bg-slate-500 data-[select]:text-white"
          onClick={() => setSelected('signup')}>
          회원가입
        </button>
      </div>
      <input
        type="text"
        ref={emailRef}
        placeholder="이메일을 입력하세요."
        className="w-full rounded p-2 mb-1 placeholder:text-sm"
      />
      {errorMessage.email !== '' && <p className="text-sm text-amber-500 mb-1">{errorMessage.email}</p>}
      <input
        type="password"
        ref={passwordRef}
        placeholder="비밀번호를 입력하세요. (영어 소문자, 숫자 포함 6자리 이상)"
        className="w-full rounded p-2 mb-1 placeholder:text-sm"
      />
      {errorMessage.password !== '' && <p className="text-sm text-amber-500 mb-1">{errorMessage.password}</p>}
      <button
        className="w-full rounded p-1 bg-slate-300 mt-4 text-gray-700 hover:bg-slate-200"
        onClick={() => {
          if (emailRef.current && passwordRef.current) {
            onSubmit(emailRef.current.value, passwordRef.current.value);
          }
        }}>
        {selected === 'signin' ? '로그인' : '회원가입'}
      </button>
    </div>
  );
};

export default Login;
