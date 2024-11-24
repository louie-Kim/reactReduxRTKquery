import { Outlet } from 'react-router-dom';
import Header from './Header';

const Layout = () => {
    return (
        <>
            <Header />
            <main className="App">
                {/* 중첩된 라우트를 렌더링 */}
                <Outlet />
            </main>
        </>
    )
}

export default Layout