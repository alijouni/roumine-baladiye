import React, { useState, useEffect } from 'react';
// NOTE: In a real project, you would install these packages via npm/yarn.

// --- ICONS & LOGOS (SVG Components) ---
// Using SVG components instead of external files or base64 strings is more reliable.
const OfficialLogo = ({ className }) => (
    <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <style>{`.cls-1{fill:#4a5c3d;}.cls-2{fill:#8a795d;}`}</style>
        </defs>
        <path className="cls-1" d="M85.1,48.4c0,18.8-15.2,34-34,34s-34-15.2-34-34c0-1.8,0.1-3.5,0.4-5.2h67.2C84.9,44.9,85.1,46.6,85.1,48.4z"/>
        <path className="cls-2" d="M51.1,17.6c-9.4,0-17,7.6-17,17s7.6,17,17,17s17-7.6,17-17S60.5,17.6,51.1,17.6z"/>
        <text x="50%" y="95%" dominantBaseline="middle" textAnchor="middle" fill="#4A5C3D" fontSize="12" fontFamily="Cairo, sans-serif" fontWeight="bold">بلدية رومين</text>
    </svg>
);


// --- MOCK FIREBASE FOR DEMONSTRATION ---
const mockDb = {
    news: [
        { id: '1', title: 'الإعلان عن مبادرة حديقة مجتمعية جديدة', content: 'يسر بلدية رومين أن تعلن عن إطلاق مشروع جديد لتطوير حديقة مجتمعية مركزية. يهدف المشروع إلى توفير مساحة خضراء للعائلات وسيضم ملعبًا ومسارات للمشي ومناطق للتنزه.', date: '26 آب 2025' },
        { id: '2', title: 'بيان حول جدول صيانة الطرق', content: 'يرجى العلم بأن أعمال صيانة وتعبيد الطرق ستتم على الطريق الرئيسي المؤدي إلى البلدة من 1 إلى 5 أيلول. ننصح السكان باستخدام طرق بديلة ونعتذر عن أي إزعاج.', date: '15 آب 2025' },
    ],
    documents: [
        { id: '1', title: 'طلب رخصة بناء', url: '#' },
        { id: '2', title: 'نموذج تسجيل عمل تجاري', url: '#' },
    ],
};
// --- END MOCK ---

// --- HELPER COMPONENTS ---
const PageWrapper = ({ children }) => (
    <div className="animate-fadeIn">{children}</div>
);

// --- PAGE COMPONENTS ---

const Header = ({ navigate, currentPage }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navLinks = [
        { id: 'home', text: 'الرئيسية' },
        { id: 'about', text: 'عن رومين' },
        { id: 'news', text: 'أخبار وبيانات' },
        { id: 'permits', text: 'معاملات ورخص' },
        { id: 'contact', text: 'تواصل معنا' },
        { id: 'admin', text: 'Admin' },
    ];

    const handleNavClick = (page) => {
        navigate(page);
        setIsMobileMenuOpen(false);
    };

    return (
        <header className="bg-white/80 backdrop-blur-lg shadow-sm sticky top-0 z-50">
            <div className="container mx-auto px-6 py-3 flex justify-between items-center">
                <a href="#" className="flex items-center space-x-3" onClick={() => handleNavClick('home')}>
                    <OfficialLogo className="h-14 w-auto" />
                    <span className="text-xl font-bold text-gray-800 hidden sm:inline">بلدية رومين</span>
                </a>
                <nav className="hidden md:flex items-center space-x-2">
                    {navLinks.map(link => (
                        <a key={link.id} href="#" onClick={() => handleNavClick(link.id)} 
                           className={`px-4 py-2 rounded-md text-base font-semibold transition-all duration-300 
                                      ${currentPage === link.id 
                                        ? 'bg-emerald-600 text-white shadow-md' 
                                        : 'text-gray-600 hover:bg-emerald-50 hover:text-emerald-700'}`}>
                            {link.text}
                        </a>
                    ))}
                </nav>
                <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-700">
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                </button>
            </div>
            {isMobileMenuOpen && (
                <div className="md:hidden px-6 pb-4 space-y-2 text-center animate-fadeIn">
                    {navLinks.map(link => (
                        <a key={link.id} href="#" onClick={() => handleNavClick(link.id)} 
                           className={`block py-2 rounded-md text-lg font-semibold ${currentPage === link.id ? 'bg-emerald-600 text-white' : 'text-gray-700'}`}>
                            {link.text}
                        </a>
                    ))}
                </div>
            )}
        </header>
    );
};

const Footer = () => (
    <footer className="bg-gray-800 text-white">
        <div className="container mx-auto px-6 py-8 text-center flex flex-col items-center">
            <OfficialLogo className="h-24 w-auto mb-4" />
            <p className="text-gray-300">&copy; {new Date().getFullYear()} بلدية رومين. جميع الحقوق محفوظة.</p>
            <p className="text-sm text-gray-400 mt-2">تم التصميم بعناية لمجتمعنا.</p>
        </div>
    </footer>
);

const HomePage = ({ navigate }) => (
    <PageWrapper>
        <div className="relative rounded-xl overflow-hidden h-[500px] mb-16 shadow-2xl">
            <img src="https://placehold.co/1200x500/345E40/FFFFFF?text=غابات+السنديان+في+رومين" alt="غابات السنديان المحيطة برومين" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end items-center text-white text-center p-10">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">أهلاً بكم في رومين</h1>
                <p className="text-lg md:text-xl max-w-2xl">بلدة التاريخ العريق، والمجتمع النابض بالحياة، والطبيعة الهادئة في قلب جنوب لبنان.</p>
            </div>
        </div>
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">خدمات البلدية</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ServiceCard 
              icon="news" 
              title="آخر الأخبار" 
              description="ابق على اطلاع بآخر الإعلانات الرسمية وأخبار البلدة." 
              onClick={() => navigate('news')} 
            />
            <ServiceCard 
              icon="docs" 
              title="رخص ونماذج" 
              description="يمكنك الوصول إلى جميع الطلبات والتصاريح البلدية اللازمة." 
              onClick={() => navigate('permits')} 
            />
            <ServiceCard 
              icon="contact" 
              title="تواصل معنا" 
              description="تواصل مع المكتب البلدي للاستفسارات والدعم." 
              onClick={() => navigate('contact')} 
            />
        </div>
    </PageWrapper>
);

const ServiceCard = ({ icon, title, description, onClick }) => {
    const icons = {
        news: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h2m-4 3H9m-4 4h2m-4 4h2m4-8h2m-4 4h2m-4 4h2m4-8h2m-4 4h2m-4 4h2" /></svg>,
        docs: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
        contact: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg text-center transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border-t-4 border-transparent hover:border-emerald-500">
            <div className="text-emerald-600 mx-auto mb-4">{icons[icon]}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-500 mb-6">{description}</p>
            <a href="#" onClick={onClick} className="font-semibold text-emerald-600 hover:text-emerald-800 transition-colors">اعرف المزيد &larr;</a>
        </div>
    );
};


const AboutPage = () => (
     <PageWrapper>
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">عن رومين</h2>
            <div className="bg-white p-8 md:p-12 rounded-xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
                    <div className="md:col-span-3">
                        <h3 className="text-3xl font-bold text-emerald-700 mb-4">تراث بلدتنا</h3>
                        <p className="text-gray-600 leading-relaxed mb-4 text-lg">رومين، الواقعة في محافظة النبطية جنوب لبنان، هي بلدة تشتهر بجمالها الطبيعي الخلاب، وأبرزها غابات السنديان العريقة التي تغطي التلال المحيطة بها. يُعتقد أن اسم "رومين" نفسه له جذور تاريخية تعكس تنوع الثقافات التي مرت بهذه الأرض.</p>
                        <p className="text-gray-600 leading-relaxed text-lg">مجتمعنا مبني على أساس القيم الأسرية القوية، والتقاليد الزراعية، والاحترام العميق لتراثنا الطبيعي. نحن فخورون بتاريخنا وملتزمون ببناء مستقبل مستدام ومزدهر لجميع السكان.</p>
                    </div>
                    <div className="md:col-span-2 flex flex-col items-center space-y-6">
                        <img src="https://placehold.co/600x400/8A795D/FFFFFF?text=قرية+رومين" alt="منظر خلاب لبلدة رومين" className="rounded-lg shadow-md w-full h-auto object-cover"/>
                        <OfficialLogo className="h-32 w-auto" />
                    </div>
                </div>
            </div>
        </PageWrapper>
);

const NewsPage = ({ news }) => (
    <PageWrapper>
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">أخبار وبيانات رسمية</h2>
        <div className="space-y-8">
            {news.length > 0 ? news.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-2xl flex flex-col md:flex-row">
                    <div className="w-full md:w-1/3">
                        <img src={`https://placehold.co/400x300/345E40/FFFFFF?text=${encodeURIComponent(item.title)}`} alt={item.title} className="object-cover w-full h-full" />
                    </div>
                    <div className="w-full md:w-2/3 p-6 md:p-8">
                        <p className="text-sm text-gray-500 mb-2">{item.date}</p>
                        <h3 className="text-2xl font-bold text-emerald-800 mb-3">{item.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{item.content}</p>
                    </div>
                </div>
            )) : <p className="text-center text-gray-600 text-lg">لا توجد أخبار حالياً.</p>}
        </div>
    </PageWrapper>
);

const PermitsPage = ({ documents }) => (
    <PageWrapper>
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">معاملات ورخص</h2>
        <p className="text-center text-gray-500 max-w-2xl mx-auto mb-12">هنا يمكنك العثور على جميع النماذج اللازمة للخدمات البلدية وتنزيلها. يرجى تقديم النماذج المكتملة إلى مكتب البلدية خلال ساعات العمل.</p>
        <div className="bg-white p-8 rounded-xl shadow-xl">
            <ul className="divide-y divide-gray-200">
                {documents.length > 0 ? documents.map(doc => (
                    <li key={doc.id} className="py-5 flex flex-col sm:flex-row justify-between items-center text-center sm:text-right">
                        <div className="mb-3 sm:mb-0">
                            <h4 className="font-semibold text-lg text-gray-800">{doc.title}</h4>
                        </div>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer" className="bg-emerald-600 text-white font-bold py-2 px-6 rounded-full hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg w-full sm:w-auto transform hover:-translate-y-1">
                            تحميل PDF
                        </a>
                    </li>
                )) : <p className="text-center text-gray-600 py-4">لا توجد مستندات متاحة حالياً.</p>}
            </ul>
        </div>
    </PageWrapper>
);

const ContactPage = () => (
    <PageWrapper>
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">تواصل معنا</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-xl">
                <h3 className="text-3xl font-bold text-emerald-700 mb-6">مكتب البلدية</h3>
                <div className="space-y-6 text-gray-600 text-lg">
                    <p className="flex items-start"><svg className="w-7 h-7 ml-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg><span>الساحة الرئيسية، رومين، محافظة النبطية، لبنان</span></p>
                    <p className="flex items-center"><svg className="w-7 h-7 ml-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg><span>+961 X XXX XXX</span></p>
                    <p className="flex items-center"><svg className="w-7 h-7 ml-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg><span>info@roumine.gov.lb</span></p>
                    <hr className="my-6 border-gray-200" />
                    <h4 className="font-semibold text-xl text-gray-800">ساعات العمل:</h4>
                    <p>الاثنين - الجمعة: 8:00 صباحًا - 4:00 مساءً</p>
                    <p>السبت: 8:00 صباحًا - 1:00 ظهرًا</p>
                </div>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-xl">
                <h3 className="text-3xl font-bold text-emerald-700 mb-6">أرسل لنا رسالة</h3>
                <form action="#" method="POST" onSubmit={(e) => e.preventDefault()} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">الاسم الكامل</label>
                        <input type="text" id="name" name="name" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow" required />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">البريد الإلكتروني</label>
                        <input type="email" id="email" name="email" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow" required />
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">الرسالة</label>
                        <textarea id="message" name="message" rows="5" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow" required></textarea>
                    </div>
                    <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">
                        إرسال الرسالة
                    </button>
                </form>
            </div>
        </div>
    </PageWrapper>
);


const AdminPage = ({ user, handleLogin, handleLogout, news, documents, addNews, deleteNews, addDocument, deleteDocument }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [newsTitle, setNewsTitle] = useState('');
    const [newsContent, setNewsContent] = useState('');
    
    const [docTitle, setDocTitle] = useState('');
    const [docFile, setDocFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const onLogin = (e) => {
        e.preventDefault();
        if(!email || !password) {
            setError('Please enter email and password.');
            return;
        }
        handleLogin(email, password).catch(err => setError(err.message));
    };
    
    const onAddNews = (e) => {
        e.preventDefault();
        if(!newsTitle || !newsContent) return;
        const date = new Date().toLocaleDateString('ar-LB', { day: 'numeric', month: 'long', year: 'numeric' });
        addNews({ title: newsTitle, content: newsContent, date });
        setNewsTitle('');
        setNewsContent('');
    };

    const onAddDocument = (e) => {
        e.preventDefault();
        if(!docTitle || !docFile) return;
        setIsUploading(true);
        addDocument({ title: docTitle, file: docFile }).then(() => {
            setDocTitle('');
            setDocFile(null);
            e.target.reset(); // Reset file input
        }).finally(() => setIsUploading(false));
    };


    if (!user) {
        return (
            <PageWrapper>
                <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-2xl">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">تسجيل دخول المسؤول</h2>
                    <form onSubmit={onLogin} className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">البريد الإلكتروني</label>
                            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">كلمة المرور</label>
                            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        </div>
                        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
                        <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1">دخول</button>
                    </form>
                </div>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-4xl font-bold text-gray-800">لوحة تحكم المسؤول</h2>
                    <button onClick={handleLogout} className="bg-red-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-red-700 transition-colors shadow-md">تسجيل الخروج</button>
                </div>

                {/* Manage News */}
                <div className="bg-white p-8 rounded-xl shadow-xl mb-12">
                    <h3 className="text-2xl font-bold text-emerald-700 mb-6 border-b pb-4">إدارة الأخبار</h3>
                    <form onSubmit={onAddNews} className="mb-6 space-y-4">
                        <input type="text" placeholder="عنوان الخبر" value={newsTitle} onChange={e => setNewsTitle(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        <textarea placeholder="محتوى الخبر" value={newsContent} onChange={e => setNewsContent(e.target.value)} rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                        <button type="submit" className="bg-emerald-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-emerald-700 transition-colors shadow-md">إضافة خبر</button>
                    </form>
                    <div className="space-y-4">
                        {news.map(item => (
                            <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                                <span className="font-semibold text-gray-700">{item.title}</span>
                                <button onClick={() => deleteNews(item.id)} className="text-red-500 hover:text-red-700 font-semibold">حذف</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Manage Documents */}
                <div className="bg-white p-8 rounded-xl shadow-xl">
                    <h3 className="text-2xl font-bold text-emerald-700 mb-6 border-b pb-4">إدارة المعاملات والرخص</h3>
                    <form onSubmit={onAddDocument} className="mb-6 space-y-4">
                        <input type="text" placeholder="عنوان المستند" value={docTitle} onChange={e => setDocTitle(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                        <input type="file" onChange={e => setDocFile(e.target.files[0])} accept=".pdf" className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                        <button type="submit" disabled={isUploading} className="bg-emerald-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-emerald-700 transition-colors shadow-md disabled:bg-gray-400">
                            {isUploading ? 'جاري الرفع...' : 'إضافة مستند'}
                        </button>
                    </form>
                     <div className="space-y-4">
                        {documents.map(doc => (
                            <div key={doc.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                                <span className="font-semibold text-gray-700">{doc.title}</span>
                                <button onClick={() => deleteDocument(doc.id, doc.filePath)} className="text-red-500 hover:text-red-700 font-semibold">حذف</button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};


// --- MAIN APP COMPONENT ---

export default function App() {
    // --- STATE MANAGEMENT ---
    const [currentPage, setCurrentPage] = useState('home');
    const [news, setNews] = useState([]);
    const [documents, setDocuments] = useState([]);
    const [user, setUser] = useState(null); // User authentication state
    const [loading, setLoading] = useState(true);

    // --- FIREBASE CONFIG (REPLACE WITH YOURS) ---
   const firebaseConfig = {

  apiKey: "AIzaSyBwSaGxjRHRXCGrga5yN04-4Hxzrf-fqy0",

  authDomain: "roumine-baladiye.firebaseapp.com",

  projectId: "roumine-baladiye",

  storageBucket: "roumine-baladiye.firebasestorage.app",

  messagingSenderId: "869623434206",

  appId: "1:869623434206:web:ab77afcc03d7ed403feb4f",

  measurementId: "G-T4PQB9W1FH"

};

    
    // --- DATA FETCHING EFFECT ---
    useEffect(() => {
        setNews(mockDb.news);
        setDocuments(mockDb.documents);
        setLoading(false);
    }, []);

    // --- CMS FUNCTIONS ---
    
    const handleLogin = async (email, password) => {
        console.log("Logging in with", email, password);
        if (email === "admin@roumine.gov.lb" && password === "password123") {
             setUser({ email });
             return Promise.resolve();
        } else {
             return Promise.reject(new Error("بيانات الاعتماد خاطئة."));
        }
    };
    
    const handleLogout = async () => {
        setUser(null);
    };

    const addNews = async (newsItem) => {
        console.log("Adding news:", newsItem);
        setNews(prev => [{ ...newsItem, id: Date.now().toString() }, ...prev]);
    };

    const deleteNews = async (id) => {
        console.log("Deleting news:", id);
        setNews(prev => prev.filter(item => item.id !== id));
    };
    
    const addDocument = async ({ title, file }) => {
        console.log("Uploading document:", title, file.name);
        const newDoc = { id: Date.now().toString(), title, url: '#', filePath: `documents/${file.name}` };
        setDocuments(prev => [{ ...newDoc }, ...prev]);
        return Promise.resolve();
    };
    
    const deleteDocument = async (id, filePath) => {
        console.log("Deleting document:", id, filePath);
        setDocuments(prev => prev.filter(doc => doc.id !== id));
    };


    // --- NAVIGATION & RENDERING ---
    const navigate = (page) => {
        window.scrollTo(0, 0);
        setCurrentPage(page);
    };

    const renderPage = () => {
        switch (currentPage) {
            case 'about': return <AboutPage />;
            case 'news': return <NewsPage news={news} />;
            case 'permits': return <PermitsPage documents={documents} />;
            case 'contact': return <ContactPage />;
            case 'admin': return <AdminPage 
                                    user={user} 
                                    handleLogin={handleLogin} 
                                    handleLogout={handleLogout}
                                    news={news}
                                    documents={documents}
                                    addNews={addNews}
                                    deleteNews={deleteNews}
                                    addDocument={addDocument}
                                    deleteDocument={deleteDocument}
                                />;
            case 'home':
            default:
                return <HomePage navigate={navigate} />;
        }
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><p>Loading...</p></div>
    }

    return (
        <div dir="rtl" className="bg-gray-100 min-h-screen flex flex-col font-cairo">
            <style>{`
              @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
              .font-cairo { font-family: 'Cairo', sans-serif; }
              @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
              .animate-fadeIn { animation: fadeIn 0.5s ease-in-out; }
              @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
              .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
              .delay-300 { animation-delay: 0.3s; }
            `}</style>
            <Header navigate={navigate} currentPage={currentPage} />
            <main className="container mx-auto px-6 py-16 flex-grow">
                {renderPage()}
            </main>
            <Footer />
        </div>
    );
}
