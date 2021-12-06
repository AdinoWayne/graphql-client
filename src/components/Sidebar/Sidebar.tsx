import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';
import navigations from './navigations';

const Sidebar = () => {
    return (
        <>
            {
                navigations.map(e => (
                    <StyledNavLink
                        to={e.path}
                        key={e.path}
                    >
                        {e.label}
                    </StyledNavLink>
                ))
            }

        </>
    )
}

export default Sidebar;

const StyledNavLink = styled(NavLink)`
    display: flex;
    align-items: center;
    height: 48px;
    padding-right: 24px;
    justify-content: flex-end;
    width: 100%;
    color:#333; // rgb(145, 155, 174);
    position: relative;
    text-align: right;
    font-weight: 500;
    .menu-item--title {
        
    }

    &.active {
        color: #fff;
        background-color: #ff6865;
    }

    .menu-item--icon {
        font-size: 16px;
        width: 20px;
        /* margin-right: 20px; */
    }
    &:hover {
        /* color: var(--purple-1); */
    }
   
`;