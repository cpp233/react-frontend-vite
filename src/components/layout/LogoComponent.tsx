import logger from '@utils/logger';
import './LogoComponent.css';
// import { ReactComponent as Logo } from '../../../public/Logo.svg';
import Logo6 from '@assets/Logo6.svg';

const LogoComponent = () => {
  const className = Math.random() < 0.9 ? 'rotation' : 'breathe';
  // const className = 'rotation';

  // logger.trace(Logo6);

  return (
    <>
      <div className={`logo ${className}`}>
        <img
          src={
            // 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg'
            Logo6
          }
          alt={'logo'}
        />
        {/* <Logo /> */}
      </div>
      {/* <div className='tip'>提示信息</div> */}
    </>
  );
};

export default LogoComponent;
