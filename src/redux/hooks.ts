import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
// Redux store-dan tipləri import edirik
import type { RootState, AppDispatch } from './store'; 

// Adi useDispatch yerinə bunu istifadə edəcəyik (TypeScript dəstəyi üçün)
export const useAppDispatch = () => useDispatch<AppDispatch>();

// Adi useSelector yerinə bunu istifadə edəcəyik
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;