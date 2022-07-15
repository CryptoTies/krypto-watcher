import Header from './Header';
import { ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default Layout;
