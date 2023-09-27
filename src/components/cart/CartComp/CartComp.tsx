import React, { useContext, useEffect, useState } from 'react';
import Badge, { BadgeProps } from '@mui/material/Badge';
import { styled } from '@mui/material/styles';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AppContext from '../../context';
import { getCookie } from '@/utils/cookieHandler';

const StyledBadge = styled(Badge)<BadgeProps>(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));
export default function CartComp() {
  const ctx = useContext(AppContext);
  const [hydro, setHydro] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    setTotalCount(() => getCookie('cart').totalCount);
  }, [ctx.cart]);


  useEffect(() => {
    setHydro(true);
  });
  
  if (!hydro) {
    return null;
  }

  return (
    <div aria-label="cart" className="cartIcon">
      <StyledBadge badgeContent={totalCount} color="success">
        <ShoppingCartIcon />
      </StyledBadge>
    </div>
  );
}
