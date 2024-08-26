import Image from 'next/image';
import logoImg from '@/assets/logo.png';
import { getDictionary } from '@/lib/dictionary'
import LocaleSwitcher from './locale-switcher'
import { LocaleProp } from '@/models';
import CustomLink from '../custom-link';
import AuthenticationNav from './authenticationNav';

const MainHeader: React.FC<LocaleProp> = async ({ lang }) => {
    const { navigation } = await getDictionary(lang);

    return (
        <header className="flex flex-col md:flex-row justify-between items-center py-6 px-4 md:px-20 bg-gray-100 shadow-md">
            <CustomLink href='/' lang={lang} className="flex items-center justify-center gap-8 text-gray-400 font-bold uppercase tracking-wide text-xl md:text-2xl">
                <Image src={logoImg} alt="Stee Auth Logo" width={40} height={40} className="object-contain" priority/>
                Stee Auth
            </CustomLink>
            <nav className="flex">
                <ul className="flex gap-6 list-none m-0 p-0 text-lg md:text-xl">
                    <AuthenticationNav lang={lang} navigation={navigation} />
                </ul>
                <LocaleSwitcher />
            </nav>
        </header>
    );
};

export default MainHeader;


