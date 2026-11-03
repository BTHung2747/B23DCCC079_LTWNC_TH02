import { memo, useState } from 'react';
import type { FormEvent } from 'react';
import { useRoutineDispatch } from './NguCanhGiaoAn';

interface RoutineCreateFormProps {
  isNameTaken: (name: string) => boolean;
}

const RoutineCreateForm = memo(function RoutineCreateForm({ isNameTaken }: RoutineCreateFormProps) {
  const dispatch = useRoutineDispatch();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) { setError('Tên giáo án không được để trống'); return; }
    if (isNameTaken(trimmedName)) { setError('Tên giáo án đã tồn tại'); return; }
    dispatch({ type: 'create', id: crypto.randomUUID(), name: trimmedName });
    setName('');
    setError('');
  }

  return (
    <form className="routine-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="routine-name">Tên giáo án</label>
        <input id="routine-name" placeholder="Ví dụ: Ngày ngực, Buổi sáng..." value={name} onChange={(event) => { setName(event.target.value); setError(''); }} aria-invalid={!!error} aria-describedby={error ? 'routine-name-error' : undefined} />
      </div>
      <button className="button button-primary" type="submit">Tạo</button>
      {error && <p className="error-message form-error" id="routine-name-error" role="alert">{error}</p>}
    </form>
  );
});

export default RoutineCreateForm;
