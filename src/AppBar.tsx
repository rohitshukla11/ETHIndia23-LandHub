import { AppBar as MuiAppBar, Typography, styled, Box, Button } from '@mui/material'
import { SafeGetUserInfoResponse, Web3AuthModalPack } from '@safe-global/auth-kit'
import './App.css'

type AppBarProps = {
  isLoggedIn: boolean
  onLogin: () => void
  onLogout: () => void
  userInfo?: SafeGetUserInfoResponse<Web3AuthModalPack>
}

const AppBar = ({ isLoggedIn, onLogin, onLogout, userInfo }: AppBarProps) => {
  return (
    <StyledAppBar position="absolute" >
      <Typography variant="h3" pl={4} fontWeight={700}>
        <span style={{display: 'flex'}}><img src='images/eth-logo.png' width={60} /><span style={{ marginTop: '20px' }}>T Spirit</span> </span>
      </Typography>

      <Box mr={5}>
        {isLoggedIn ? (
          <Box display="flex" alignItems="center">
            {userInfo && (
              <Typography variant="body1" fontWeight={700}>
                <span style={{marginRight: '20px'}}>Hello {userInfo.name || userInfo.email} !!</span>
                
              </Typography>
            )}
            <button className='login-btn'onClick={onLogout} style={{ marginTop: '20px' }} > Log Out</button>
          </Box>
        ) : (
          <>
            <button className='login-btn' onClick={onLogin} style={{ marginTop: '20px' }} >Login</button>
          </> 

        )}
      </Box>
    </StyledAppBar>
  )
}

const StyledAppBar = styled(MuiAppBar)`
  && {
    position: sticky;
    top: 0;
    background: rgb(255,231,185);
    border-bottom:none !important;
    height: 70px;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
    color:black;
    border-bottom: 2px solid ${({ theme }) => theme.palette.background.paper};
    box-shadow: none;
  }
`

export default AppBar
