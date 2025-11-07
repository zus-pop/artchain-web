import { HeaderWrapper } from '@/components/sections/HeaderWrapper';
import React from 'react';

const ClientLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      {/* <HeaderWrapper /> */}
      {children}
    </div>
  )
}

export default ClientLayout
