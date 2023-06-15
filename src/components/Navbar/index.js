/**
 * Dieser Code definiert eine Navigationsleiste in einer Webanwendung. 
 * Die Navigationsleiste enthält ein Logo und Links zu verschiedenen Seiten der Anwendung. 
 * Die Navigationsleiste wird mit Hilfe von React erstellt.
 */

import React from 'react';
import { ReactComponent as Logo } from '../../images/btcLogo.svg';
import {
  Nav,
  NavLink,
  Bars,
  NavMenu,
} from './NavbarElements';

const Navbar = () => {
  return (
    <>
      <Nav>
        <NavLink to='/'>
          <Logo />
        </NavLink>
        <Bars />
        <NavMenu>
          <NavLink to='/memory' activeStyle>
            Memory
          </NavLink>
          <NavLink to='/btc-man' activeStyle>
            Btc-man
          </NavLink>
          <NavLink to='/quiz' activeStyle>
            Quiz
          </NavLink>
        </NavMenu>
      </Nav>
    </>
  );
};

export default Navbar;