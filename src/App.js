import React, { useState, useEffect, useRef } from 'react';

import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { collection, getDocs, addDoc, deleteDoc, doc, query, orderBy, serverTimestamp, where, writeBatch, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { auth, db, storage } from './firebase';
import emailjs from '@emailjs/browser';

import { ReactComponent as OfficialLogo } from './baladiye-logo.svg'; 
import { ReactComponent as OfficialLogoInvert } from './baladiye-logo-invert.svg'; 
import homeImage from './img/roumine_trees.jpg';
import historicalRoumine from './img/historical_roumine.jpg';
import roumineRoad from './img/roumine_road.jpg';
import modernRoumine from './img/modern_roumine.jpg';


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
        { id: 'permits', text: 'معاملات ونماذج' },
        { id: 'fees', text: 'الرسوم البلدية' }, // --- NEW PAGE LINK ---
        { id: 'surveys', text: 'شكاوى واستمارات' },
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
                <a href="#" className="flex items-center space-x-2" onClick={() => handleNavClick('home')}>
                    <OfficialLogo className="h-14 w-auto" />
                    <span className="mr-10 text-xl font-bold text-gray-800 hidden sm:inline">بلدية رومين</span>
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
            <OfficialLogoInvert className="h-24 w-auto mb-4" />
            <p className="text-gray-300">&copy; {new Date().getFullYear()} بلدية رومين. جميع الحقوق محفوظة.</p>
            <p className="text-sm text-gray-400 mt-2">تم التصميم بعناية لمجتمعنا.</p>
        </div>
    </footer>
);

const HomePage = ({ navigate }) => (
    <PageWrapper>
        <div className="relative rounded-xl overflow-hidden h-[500px] mb-16 shadow-2xl">
            <img src={homeImage} alt="غابات السنديان المحيطة برومين" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end items-center text-white text-center p-10">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">أهلاً بكم في رومين</h1>
                <p className="text-lg md:text-xl max-w-2xl">بلدة التاريخ العريق، والمجتمع النابض بالحياة، والطبيعة الهادئة في قلب جنوب لبنان.</p>
            </div>
        </div>
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">خدمات البلدية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard 
              icon="news" 
              title="آخر الأخبار" 
              description="ابق على اطلاع بآخر الإعلانات الرسمية وأخبار البلدة." 
              onClick={() => navigate('news')} 
            />
            <ServiceCard 
              icon="docs" 
              title="معاملات ونماذج" 
              description="يمكنك الوصول إلى جميع الطلبات والتصاريح البلدية اللازمة." 
              onClick={() => navigate('permits')} 
            />
            {/* --- NEW SERVICE CARD --- */}
            <ServiceCard 
              icon="fees"
              title="الرسوم البلدية" 
              description="الاستعلام عن الرسوم البلدية المتوجبة على القيمة التأجيرية."
              onClick={() => navigate('fees')} 
            />
            <ServiceCard 
              icon="surveys"
              title="شكاوى واستمارات" 
              description="شارك برأيك وقدم ملاحظاتك لتحسين بلدتنا."
              onClick={() => navigate('surveys')} 
            />
            {/* --- MOVED CONTACT TO END FOR BETTER GRID FILL --- */}
            {/* <ServiceCard 
              icon="contact" 
              title="تواصل معنا" 
              description="تواصل مع المكتب البلدي للاستفسارات والدعم." 
              onClick={() => navigate('contact')} 
            /> */}
        </div>
    </PageWrapper>
);

const ServiceCard = ({ icon, title, description, onClick }) => {
   const icons = {
        news: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3h2m-4 3H9m-4 4h2m-4 4h2m4-8h2m-4 4h2m-4 4h2m4-8h2m-4 4h2m-4 4h2" /></svg>,
        docs: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
        contact: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
        surveys: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
        fees: <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg> // --- NEW ICON ---
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
    <div className="grid grid-cols-1 md:grid-cols-5 gap-12"> {/* Removed items-center from here */}
      
      {/* Images Column - now on the left for md and larger, stacked on mobile */}
      <div className="md:col-span-2 flex flex-col items-center space-y-6 order-first md:order-first"> {/* order-first ensures it's first on mobile too */}
        <img src={historicalRoumine} alt="رومين قديماً" className="w-full h-auto rounded-lg shadow-md" />
        <img src={roumineRoad} alt="رومين في منتصف القرن" className="w-full h-auto rounded-lg shadow-md" />
        <img src={modernRoumine} alt="بلدتنا اليوم" className="w-full h-auto rounded-lg shadow-md" />
      </div>

      {/* Text Column - now on the right for md and larger */}
      <div className="md:col-span-3 order-last md:order-last"> {/* order-last ensures it's last on mobile too */}
        <h3 className="text-3xl font-bold text-emerald-700 mb-4">تراث بلدتنا</h3>
        
        {/* The historical text starts here */}
        <div className="text-gray-600 leading-relaxed mb-4 text-lg">
            <p className="mb-4">
                تقع بلدة رومين على تلال منبسطة في قضاء النبطية بجنوب لبنان، حاملةً في اسمها وتضاريسها شذرات من تاريخ منطقة جبل عامل العريقة. يستند تاريخها إلى مصادر متعددة، أبرزها المعاجم الجغرافية التاريخية لمنطقة جبل عامل، بالإضافة إلى الروايات الشفهية والآثار المكتشفة في أراضيها.
            </p>

            <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">أصل التسمية ودلالاتها القديمة</h4>
            <p className="mb-4">
                يُرجّح المؤرخون، وعلى رأسهم الشيخ سليمان ظاهر في كتابه "معجم قرى جبل عامل"، أن اسم "رومين" يعود إلى أصل سرياني هو "Rawmin" (ܪܘܡܝܢ)، والذي يعني "الهضاب" أو "المرتفعات". يتطابق هذا التفسير مع الطبيعة الجغرافية للبلدة التي تقوم على مجموعة من التلال.
            </p>
            <p className="mb-4">
                وإلى جانب هذا التفسير العلمي، تتداول رواية شعبية أن الاسم مرتبط بوجود روماني قديم في المنطقة، وأن "رومين" هي تحريف لكلمة "رومان". يدعم هذه الرواية وجود بعض الآثار في البلدة، مثل المغاور المدفنية والنواويس المحفورة في الصخر في منطقة "ظهر النسور" شمال البلدة، بالإضافة إلى أسطورة محلية تتحدث عن مغارة دُفن فيها ملك وملكة من العهد الروماني. وعلى الرغم من شيوع هذه الرواية، لم يتم العثور على آثار كبرى تؤكد وجود مدينة رومانية متكاملة في الموقع.
            </p>

            <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">رومين في العهد العثماني: الإقطاع والملكية</h4>
            <p className="mb-4">
                كغيرها من قرى جبل عامل، خضعت رومين لنظام الإقطاع الذي كان سائدًا في العهد العثماني. وتشير المصادر التاريخية إلى أن أراضي البلدة كانت في فترة من الفترات مملوكة لعائلات إقطاعية نافذة في المنطقة. فقد ذكر الشيخ سليمان ظاهر أن قسماً كبيراً من أراضي رومين كان ملكاً لـ "حسن أفندي والحاج حسين الزين"، وهما من عائلة "آل الزين" التي كانت تمتلك نفوذاً واسعاً وأملاكاً شاسعة في عموم جبل عامل.
            </p>
             <p className="mb-4">
                ولا يزال في البلدة حتى اليوم دار قديمة ذات طابع تراثي مسقوفة بالقرميد، يُقال إنها كانت ملكاً لإسماعيل الزين، أحد وجهاء العائلة. مع مرور الزمن وتغير الأنظمة السياسية والاجتماعية في لبنان، انتقلت ملكية هذه الأراضي تدريجياً من العائلات الإقطاعية إلى أهالي البلدة وسكانها.
            </p>

            <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">التاريخ الاجتماعي والاقتصادي</h4>
            <p className="mb-4">
                اعتمد اقتصاد رومين تقليدياً على الزراعة، مستفيداً من أراضيها الخصبة ومناخها المتوسطي. وقد اشتهرت بزراعة الزيتون، الذي لا تزال أشجاره المعمرة تغطي أجزاء واسعة من أراضيها، بالإضافة إلى الكرمة والتين واللوز وبعض الزراعات الموسمية.
            </p>
            <p className="mb-4">
            في العقود الأخيرة من القرن العشرين، برزت في رومين صناعة حرفية دقيقة، وهي صياغة الذهب والفضة، حيث عُرفت البلدة بوجود عدد من المعامل والورش التي عمل فيها أبناؤها واكتسبوا شهرة في هذا المجال. 
             </p>

            <h4 className="text-xl font-semibold text-gray-800 mt-6 mb-3">رومين في التاريخ الحديث</h4>
            <p className="mb-4">
                إدارياً، كانت رومين تتبع قديماً "إقليم التفاح"، وهو أحد التقسيمات التاريخية لمنطقة جبل عامل. أما في التقسيمات الإدارية الحديثة للدولة اللبنانية، فأصبحت جزءاً من قضاء النبطية في محافظة النبطية.
            </p>
            <p className="mb-4">
                وكحال معظم القرى اللبنانية، شهدت رومين هجرة كبيرة لأبنائها، سواء إلى العاصمة بيروت أو إلى خارج لبنان، بحثاً عن فرص العلم والعمل، مما أثر على بنيتها الديموغرافية. ورغم ذلك، لا تزال البلدة مرتبطة بتاريخها وجذورها، محافظةً على طابعها القروي الهادئ ضمن السياق التاريخي والثقافي لمنطقة جبل عامل.
            </p>
            <div className="flex justify-center mt-12">
            <OfficialLogo className="text-center h-32 w-auto" />
            </div>
            
        </div>
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
                <div key={item.id} className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow hover:shadow-2xl flex flex-col md:flex-row md:items-center">
                    {/* --- Image Section (Modified) --- */}
                    <div className="w-full md:w-1/4">
                        <img src={item.imageUrl} alt={item.title} className="object-cover w-full" />
                    </div>
                    {/* --- Text Section (Modified) --- */}
                    <div className="w-full md:w-3/4 p-6 md:p-8">
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
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">معاملات ونماذج</h2>
        <p className="text-center text-gray-500 max-w-2xl mx-auto mb-12">هنا يمكنك العثور على جميع النماذج اللازمة للخدمات البلدية وتنزيلها. يرجى تقديم النماذج المكتملة إلى مكتب البلدية خلال ساعات .</p>
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

// --- NEW SECTION: DUE FEES PAGE ---
const DueFeesPage = () => {
    const [nameQuery, setNameQuery] = useState('');
    const [propQuery, setPropQuery] = useState('');
    const [results, setResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!nameQuery && !propQuery) {
            setMessage("الرجاء إدخال الاسم الثلاثي أو رقم العقار للبحث.");
            setResults([]);
            return;
        }

        setIsLoading(true);
        setMessage('');
        setResults([]);
        
        try {
            const feesCollection = collection(db, "dueFees");
            const queries = [];

            // Query by name if provided
            if (nameQuery.trim()) {
                queries.push(getDocs(query(feesCollection, where("fullName", "==", nameQuery.trim()))));
            }

            // Query by property number if provided
            if (propQuery.trim()) {
                queries.push(getDocs(query(feesCollection, where("propertyNumber", "==", propQuery.trim()))));
            }

            // Await all queries
            const snapshots = await Promise.all(queries);

            // Use a Map to combine results and remove duplicates (by doc ID)
            const resultsMap = new Map();
            snapshots.forEach(snapshot => {
                snapshot.docs.forEach(doc => {
                    resultsMap.set(doc.id, { id: doc.id, ...doc.data() });
                });
            });

            const combinedResults = Array.from(resultsMap.values());

            if (combinedResults.length === 0) {
                setMessage("لم يتم العثور على نتائج مطابقة لبحثك.");
            }
            
            setResults(combinedResults);

        } catch (error) {
            console.error("Error searching due fees: ", error);
            setMessage("حدث خطأ أثناء البحث. يرجى المحاولة مرة أخرى.");
        }

        setIsLoading(false);
    };

    return (
        <PageWrapper>
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">الاستعلام عن الرسوم البلدية</h2>
            <p className="text-center text-gray-500 max-w-2xl mx-auto mb-12">
                للاستعلام عنالرسوم المتوجبة على القيمة التأجيرية،
                الرجاء إدخال الاسم الثلاثي للمكلف أو رقم العقار.
            </p>
            
            {/* Search Form */}
            <div className="bg-white p-8 rounded-xl shadow-xl max-w-2xl mx-auto mb-12">
                <form onSubmit={handleSearch} className="space-y-6">
                    <div>
                        <label htmlFor="fullName" className="block text-gray-700 font-semibold mb-2">الاسم الثلاثي للمكلف</label>
                        <input 
                            type="text" 
                            id="fullName" 
                            value={nameQuery}
                            onChange={(e) => setNameQuery(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow" 
                            placeholder="مثال: جون فؤاد ضاهر"
                        />
                    </div>
                    <div className="text-center text-gray-500 font-semibold">أو</div>
                    <div>
                        <label htmlFor="propertyNumber" className="block text-gray-700 font-semibold mb-2">رقم العقار</label>
                        <input 
                            type="text" 
                            id="propertyNumber" 
                            value={propQuery}
                            onChange={(e) => setPropQuery(e.target.value)}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-shadow" 
                            placeholder="مثال: 1234"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={isLoading} 
                        className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:bg-emerald-300"
                    >
                        {isLoading ? 'جاري البحث...' : 'بحث'}
                    </button>
                </form>
            </div>

            {/* Results Section */}
            {isLoading && <p className="text-center text-lg text-gray-600">جاري البحث...</p>}
            
            {message && <p className="text-center text-lg font-semibold text-red-600">{message}</p>}

            {results.length > 0 && (
                <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl overflow-x-auto">
                    <h3 className="text-2xl font-bold text-emerald-700 mb-6">نتائج البحث</h3>
                    <div className="min-w-full">
                        <table className="w-full text-right">
                            <thead className="border-b-2 border-gray-200">
                                <tr>
                                    <th className="py-3 px-4 text-gray-600 font-bold">الاسم الثلاثي</th>
                                    <th className="py-3 px-4 text-gray-600 font-bold">رقم العقار</th>
                                    <th className="py-3 px-4 text-gray-600 font-bold">الموقع (اختياري)</th>
                                    <th className="py-3 px-4 text-gray-600 font-bold">الرسم المتوجب</th>
                                </tr>
                            </thead>
                            <tbody>
                                {results.map(item => (
                                    <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-4 px-4 text-gray-800">{item.fullName}</td>
                                        <td className="py-4 px-4 text-gray-800">{item.propertyNumber}</td>
                                        <td className="py-4 px-4 text-gray-600">{item.location || '-'}</td>
                                        <td className="py-4 px-4 text-emerald-700 font-bold">
                                            {/* Format as currency (optional but recommended) */}
                                            {new Intl.NumberFormat('ar-LB', { style: 'currency', currency: 'LBP' }).format(item.dueFee || 0)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </PageWrapper>
    );
};

const ContactPage = () => {
    const form = useRef();
    const [statusMessage, setStatusMessage] = useState("");
    const [isError, setIsError] = useState(false);
    const [isSending, setIsSending] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSending(true);
        setStatusMessage("");
        setIsError(false);

        const formData = new FormData(form.current);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        if (!name || !email || !message) {
            setStatusMessage("يرجى ملء جميع الحقول.");
            setIsError(true);
            setIsSending(false);
            return;
        }

        emailjs.sendForm(
            process.env.REACT_APP_EMAILJS_SERVICE_ID,
            process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
            form.current,
            process.env.REACT_APP_EMAILJS_PUBLIC_KEY
        )
        .then(() => {
            console.log('Email successfully sent!');
            return addDoc(collection(db, "messages"), {
                name: name,
                email: email,
                message: message,
                createdAt: serverTimestamp()
            });
        })
        .then(() => {
            console.log('Message saved to Firestore!');
            setStatusMessage("تم إرسال رسالتك بنجاح!");
            setIsError(false);
            setIsSending(false);
            form.current.reset();
        })
        .catch((err) => {
            console.error('Failed to send message:', err);
            setStatusMessage("فشل إرسال الرسالة. الرجاء المحاولة مرة أخرى.");
            setIsError(true);
            setIsSending(false);
        });
    };

    return (
        <PageWrapper>
            <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">تواصل معنا</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="bg-white p-8 rounded-xl shadow-xl">
                    <h3 className="text-3xl font-bold text-emerald-700 mb-6">مكتب البلدية</h3>
                    <div className="space-y-6 text-gray-600 text-lg">
                        <p className="flex items-start"><svg className="w-7 h-7 ml-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg><span>مدخل القرية الجنوبي مقابل ثانوية رومين الرسمية ، رومين ، محافظة النبطية ، لبنان</span></p>
                        <p className="flex items-center"><svg className="w-7 h-7 ml-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path></svg><span>+961 81 059 364</span></p>
                        <p className="flex items-center"><svg className="w-7 h-7 ml-4 text-emerald-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg><span>baladiyat.roumine@gmail.com</span></p>
                        <hr className="my-6 border-gray-200" />
                        <h4 className="font-semibold text-xl text-gray-800">ساعات العمل:</h4>
                        <p>الاثنين - الجمعة: 8:00 صباحًا - 2:00 ظهراً</p>
                        <p>السبت - الأحد: مغلق</p>
                    </div>
                    <div className="mt-8">
    <h4 className="font-semibold text-xl text-gray-800 mb-4">موقعنا على الخريطة:</h4>
    <div className="rounded-lg overflow-hidden shadow-md">
        <iframe
            title="Roumine Municipality Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3319.4673680979667!2d35.43841808486987!3d33.722513980703816!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1516f882199b50e3%3A0xc3b8a3e7e81b6c7a!2sRoumine!5e0!3m2!1sen!2slb!4v1663152206673!5m2!1sen!2slb"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
    </div>
</div>
                </div>
                <div className="bg-white p-8 rounded-xl shadow-xl">
                    <h3 className="text-3xl font-bold text-emerald-700 mb-6">أرسل لنا رسالة</h3>
                    <form ref={form} onSubmit={handleSubmit} className="space-y-6">
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
                        <button type="submit" disabled={isSending} className="w-full bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1 disabled:bg-emerald-300">
                             {isSending ? 'جار الإرسال...' : 'إرسال الرسالة'}
                        </button>
                        {statusMessage && (
                            <p className={`text-center font-medium ${isError ? 'text-red-600' : 'text-green-600'}`}>
                                {statusMessage}
                            </p>
                        )}
                    </form>
                </div>
            </div>
        </PageWrapper>
    );
};

// --- NEW COMPLAINTS AND SURVEYS PAGE ---
const ComplaintsAndSurveysPage = ({ surveys, addComplaint }) => {
    const [name, setName] = useState('');
    const [contact, setContact] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [status, setStatus] = useState('');
    const [isError, setIsError] = useState(false);

    const handleComplaintSubmit = async (e) => {
        e.preventDefault();
        
        // Add validation for the 8-digit phone number
        const phonePattern = /^\d{8}$/;
        if(!name || !contact || !subject || !message) {
            setStatus("يرجى ملء جميع الحقول.");
            setIsError(true);
            return;
        }

        if (!phonePattern.test(contact)) {
            setStatus("الرجاء إدخال رقم هاتف صحيح مكون من 8 أرقام.");
            setIsError(true);
            return;
        }
        
        try {
            await addComplaint({ name, contact, subject, message });
            setStatus("تم إرسال الشكوى بنجاح. شكراً لمساهمتكم.");
            setIsError(false);
            setName('');
            setContact('');
            setSubject('');
            setMessage('');
        } catch (error) {
            console.error("Error submitting complaint: ", error);
            setStatus("حدث خطأ أثناء إرسال الشكوى. يرجى المحاولة مرة أخرى.");
            setIsError(true);
        }
    };

    return (
        <PageWrapper>
            <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">شكاوى واستمارات</h2>
                <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                    منصتكم للتواصل المباشر. شاركونا آراءكم أو قدموا شكاوى، وساهموا في اتخاذ القرار عبر الاستبيانات.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                {/* Complaints Section - Right Column */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                    <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
                        <div className="bg-red-100 p-3 rounded-full ml-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        </div>
                        <div>
                             <h3 className="text-2xl font-bold text-gray-800">تقديم شكوى أو اقتراح</h3>
                             <p className="text-sm text-gray-500">سيتم التعامل مع رسالتك بسرية تامة</p>
                        </div>
                    </div>

                    <form onSubmit={handleComplaintSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">الاسم الكامل</label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={e => setName(e.target.value)} 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors" 
                                    placeholder="الاسم الثلاثي"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label>
                                <input 
                                    type="tel" 
                                    value={contact} 
                                    onChange={e => setContact(e.target.value)} 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors" 
                                    placeholder="xxxxxxxx"
                                    pattern="\d{8}" 
                                    maxLength="8"
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">الموضوع</label>
                            <input 
                                type="text" 
                                value={subject} 
                                onChange={e => setSubject(e.target.value)} 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors" 
                                placeholder="اختصار لموضوع الشكوى"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">التفاصيل</label>
                            <textarea 
                                value={message} 
                                onChange={e => setMessage(e.target.value)} 
                                rows="5" 
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors resize-none" 
                                placeholder="اشرح لنا المشكلة أو الاقتراح بالتفصيل..."
                                required
                            ></textarea>
                        </div>
                        <button 
                            type="submit" 
                            className="w-full bg-emerald-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-emerald-700 hover:shadow-lg transition-all duration-300 transform active:scale-95 flex justify-center items-center gap-2"
                        >
                            <span>إرسال</span>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </button>
                        {status && (
                            <div className={`p-4 rounded-lg text-center font-semibold ${isError ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                {status}
                            </div>
                        )}
                    </form>
                </div>

                {/* Surveys Section - Left Column */}
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 h-full">
                    <div className="flex items-center mb-6 border-b border-gray-100 pb-4">
                        <div className="bg-blue-100 p-3 rounded-full ml-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">استمارات واستطلاعات</h3>
                            <p className="text-sm text-gray-500">رأيكم يساهم في تطوير بلدتنا</p>
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        {surveys.length > 0 ? surveys.map(survey => (
                            <div key={survey.id} className="group bg-white border border-gray-200 p-6 rounded-xl hover:border-emerald-500 hover:shadow-md transition-all duration-300">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <h4 className="font-bold text-lg text-gray-800 group-hover:text-emerald-700 transition-colors">{survey.title}</h4>
                                        {survey.details && <p className="text-sm text-gray-500 mt-1">{survey.details}</p>}
                                    </div>
                                    <a 
                                        href={survey.link} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="w-full sm:w-auto text-center bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold py-2 px-6 rounded-full hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all duration-300 text-sm whitespace-nowrap"
                                    >
                                        المشاركة الآن
                                    </a>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500 font-medium">لا توجد استطلاعات نشطة حالياً</p>
                                <p className="text-sm text-gray-400 mt-1">يرجى التحقق لاحقاً</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
};

const AdminPage = ({ user, handleLogin, handleLogout, news, documents, surveys, complaints, addNews, deleteNews, addDocument, deleteDocument, addSurvey, deleteSurvey, updateComplaintStatus, deleteComplaint,handleFeesUpload }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const [newsTitle, setNewsTitle] = useState('');
    const [newsContent, setNewsContent] = useState('');
    const [newsImage, setNewsImage] = useState(null);
    
    const [docTitle, setDocTitle] = useState('');
    const [docFile, setDocFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const [surveyTitle, setSurveyTitle] = useState('');
    const [surveyLink, setSurveyLink] = useState('');
     const [surveyDetails, setSurveyDetails] = useState(''); 
const [feesFile, setFeesFile] = useState(null);
    const [isUploadingFees, setIsUploadingFees] = useState(false);
      const [filter, setFilter] = useState('all');
      
      
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
        if(!newsTitle || !newsContent || !newsImage) {
            alert("يرجى ملء جميع الحقول واختيار صورة.");
            return;
        };
        const date = new Date().toLocaleDateString('ar-LB', { day: 'numeric', month: 'long', year: 'numeric' });
        addNews({ title: newsTitle, content: newsContent, date, imageFile: newsImage });
        setNewsTitle('');
        setNewsContent('');
        setNewsImage(null);
        e.target.reset();
    };

    const onAddDocument = (e) => {
        e.preventDefault();
        if(!docTitle || !docFile) return;
        setIsUploading(true);
        addDocument({ title: docTitle, file: docFile }).then(() => {
            setDocTitle('');
            setDocFile(null);
            e.target.reset(); 
        }).finally(() => setIsUploading(false));
    };

    const onAddSurvey = (e) => {
        e.preventDefault();
        if (!surveyTitle || !surveyLink) return;
        addSurvey({ title: surveyTitle, link: surveyLink, details: surveyDetails }); // Updated call
        setSurveyTitle('');
        setSurveyLink('');
        setSurveyDetails(''); // Reset new state
    };

     // Filter complaints based on the selected status
    const filteredComplaints = complaints.filter(complaint => {
        if (filter === 'all') return true;
        return complaint.status === filter;
    });

const onUploadFees = (e) => {
        e.preventDefault();
        if (!feesFile) {
            alert("يرجى اختيار ملف JSON.");
            return;
        }
        setIsUploadingFees(true);
        // This function needs to be implemented in the main App component
        // It should handle reading the JSON file and batch-writing to Firestore
        handleFeesUpload(feesFile)
            .then(() => {
                alert("تم تحديث جدول الرسوم بنجاح.");
                setFeesFile(null);
                e.target.reset();
            })
            .catch(err => {
                console.error(err);
                alert("فشل تحديث الرسوم. راجع الكونسول.");
            })
            .finally(() => setIsUploadingFees(false));
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <div>
                        {/* Manage News */}
                        <div className="bg-white p-8 rounded-xl shadow-xl mb-12">
                            <h3 className="text-2xl font-bold text-emerald-700 mb-6 border-b pb-4">إدارة الأخبار</h3>
                            <form onSubmit={onAddNews} className="mb-6 space-y-4">
                                <input type="text" placeholder="عنوان الخبر" value={newsTitle} onChange={e => setNewsTitle(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                                <textarea placeholder="محتوى الخبر" value={newsContent} onChange={e => setNewsContent(e.target.value)} rows="4" className="w-full px-4 py-3 border border-gray-300 rounded-lg"></textarea>
                                <div>
                                    <label className="block text-gray-700 font-semibold mb-2">صورة الخبر</label>
                                    <input type="file" onChange={e => setNewsImage(e.target.files[0])} accept="image/*" className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                                </div>
                                <button type="submit" className="bg-emerald-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-emerald-700">إضافة خبر</button>
                            </form>
                            <div className="space-y-4 max-h-60 overflow-y-auto">
                                {news.map(item => (
                                    <div key={item.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                                        <span className="font-semibold text-gray-700">{item.title}</span>
                                        <button onClick={() => deleteNews(item.id)} className="text-red-500 hover:text-red-700 font-semibold">حذف</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Manage Documents */}
                        <div className="bg-white p-8 rounded-xl shadow-xl mb-12">
                             <h3 className="text-2xl font-bold text-emerald-700 mb-6 border-b pb-4">إدارة المعاملات والنماذج</h3>
                            <form onSubmit={onAddDocument} className="mb-6 space-y-4">
                                <input type="text" placeholder="عنوان المستند" value={docTitle} onChange={e => setDocTitle(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
                                <input type="file" onChange={e => setDocFile(e.target.files[0])} accept=".pdf" className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                                <button type="submit" disabled={isUploading} className="bg-emerald-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400">
                                    {isUploading ? 'جاري الرفع...' : 'إضافة مستند'}
                                </button>
                            </form>
                             <div className="space-y-4 max-h-60 overflow-y-auto">
                                {documents.map(doc => (
                                    <div key={doc.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                                        <span className="font-semibold text-gray-700">{doc.title}</span>
                                        <button onClick={() => deleteDocument(doc.id, doc.filePath)} className="text-red-500 hover:text-red-700 font-semibold">حذف</button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-xl shadow-xl mb-12">
                             <h3 className="text-2xl font-bold text-emerald-700 mb-6 border-b pb-4">إدارة الرسوم المتوجبة</h3>
                             <p className="text-sm text-gray-600 mb-4">
                                هام: يرجى تحويل ملف الإكسل إلى ملف <code className="bg-gray-200 p-1 rounded">.json</code> قبل الرفع.
                                يجب أن يكون الملف بصيغة:
                                <br />
                                <code className="text-xs">
                                    [{"{"}"fullName": "...", "propertyNumber": "...", "dueFee": 150000{"}"}, ...]
                                </code>
                             </p>
                            <form onSubmit={onUploadFees} className="mb-6 space-y-4">
                                <input type="file" onChange={e => setFeesFile(e.target.files[0])} accept=".json" className="w-full file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
                                <button type="submit" disabled={isUploadingFees} className="bg-emerald-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-emerald-700 disabled:bg-gray-400">
                                    {isUploadingFees ? 'جاري التحديث...' : 'رفع وتحديث جدول الرسوم'}
                                </button>
                            </form>
                        </div>
                         {/* Manage Surveys */}
                         <div className="bg-white p-8 rounded-xl shadow-xl">
        <h3 className="text-2xl font-bold text-emerald-700 mb-6 border-b pb-4">إدارة الاستمارات</h3>
        <form onSubmit={onAddSurvey} className="mb-6 space-y-4">
            <input type="text" placeholder="عنوان الاستمارة" value={surveyTitle} onChange={e => setSurveyTitle(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
            <textarea placeholder="تفاصيل الاستمارة (اختياري)" value={surveyDetails} onChange={e => setSurveyDetails(e.target.value)} rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-lg"></textarea>
            <input type="url" placeholder="رابط Microsoft Forms" value={surveyLink} onChange={e => setSurveyLink(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg" />
            <button type="submit" className="bg-emerald-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-emerald-700">إضافة استمارة</button>
        </form>
        <div className="space-y-4 max-h-60 overflow-y-auto">
            {surveys.map(survey => (
                <div key={survey.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg border">
                    <span className="font-semibold text-gray-700">{survey.title}</span>
                    <button onClick={() => deleteSurvey(survey.id)} className="text-red-500 hover:text-red-700 font-semibold">حذف</button>
                </div>
            ))}
        </div>
    </div>
                    </div>
                    
                    <div>
                        {/* View Complaints */}
                        <div className="bg-white p-8 rounded-xl shadow-xl">
                        <div className="flex justify-between items-center mb-6 border-b pb-4">
                            <h3 className="text-2xl font-bold text-emerald-700">الشكاوى والاقتراحات الواردة</h3>
                            <select value={filter} onChange={e => setFilter(e.target.value)} className="p-2 border rounded-md">
                                <option value="all">الكل</option>
                                <option value="pending">قيد المعالجة</option>
                                <option value="resolved">تمت المعالجة</option>
                            </select>
                        </div>
                        <div className="space-y-4 max-h-[800px] overflow-y-auto">
                            {filteredComplaints.length > 0 ? filteredComplaints.map(complaint => (
                                <div key={complaint.id} className="p-4 bg-white rounded-xl shadow-md border border-gray-200">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="font-bold text-lg text-gray-800">{complaint.subject}</h4>
                                        <span className={`text-sm font-semibold px-2 py-1 rounded-full ${complaint.status === 'resolved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                            {complaint.status === 'resolved' ? 'تمت المعالجة' : 'قيد المعالجة'}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-1"><strong>من:</strong> {complaint.name}</p>
                                    <p className="text-sm text-gray-600 mb-3"><strong>للتواصل:</strong> {complaint.contact}</p>
                                    <p className="text-gray-700 whitespace-pre-wrap">{complaint.message}</p>
                                    <div className="mt-4 flex justify-end space-x-2">
                                        {complaint.status !== 'resolved' && (
                                            <button onClick={() => updateComplaintStatus(complaint.id, 'resolved')} className="bg-emerald-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-md">
                                                وضع علامة "تمت المعالجة"
                                            </button>
                                        )}
                                        <button onClick={() => deleteComplaint(complaint.id)} className="bg-red-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md">
                                            حذف
                                        </button>
                                    </div>
                                </div>
                            )) : <p className="text-center text-gray-500">لا توجد شكاوى حالياً.</p>}
                        </div>
                    </div>
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
    const [surveys, setSurveys] = useState([]);
    const [complaints, setComplaints] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- FIREBASE AUTHENTICATION OBSERVER ---
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // --- DATA FETCHING FROM FIRESTORE ---
    useEffect(() => {
        const fetchData = async () => {
            // Fetch News
            const newsCollection = collection(db, "news");
            const newsQuery = query(newsCollection, orderBy("createdAt", "desc"));
            const newsSnapshot = await getDocs(newsQuery);
            setNews(newsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            // Fetch Documents
            const documentsCollection = collection(db, "documents");
            const docQuery = query(documentsCollection, orderBy("createdAt", "desc"));
            const documentsSnapshot = await getDocs(docQuery);
            setDocuments(documentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            
            // Fetch Surveys
            const surveysCollection = collection(db, "surveys");
            const surveyQuery = query(surveysCollection, orderBy("createdAt", "desc"));
            const surveysSnapshot = await getDocs(surveyQuery);
            setSurveys(surveysSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            // Fetch Complaints
            const complaintsCollection = collection(db, "complaints");
            const complaintQuery = query(complaintsCollection, orderBy("createdAt", "desc"));
            const complaintsSnapshot = await getDocs(complaintQuery);
            setComplaints(complaintsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        };

        fetchData();
    }, []);


    // --- CMS FUNCTIONS (Interacting with Firebase) ---
    
    const handleLogin = (email, password) => signInWithEmailAndPassword(auth, email, password);
    const handleLogout = () => signOut(auth);

    const addNews = async (newsItem) => {
        const { title, content, date, imageFile } = newsItem;
        const imageRef = ref(storage, `news-images/${Date.now()}_${imageFile.name}`);
        
        await uploadBytes(imageRef, imageFile);
        const imageUrl = await getDownloadURL(imageRef);

        const newNews = { title, content, date, imageUrl, createdAt: new Date() };
        const docRef = await addDoc(collection(db, "news"), newNews);

        setNews(prev => [{ id: docRef.id, ...newNews }, ...prev]);
    };
    
    const deleteNews = async (id) => {
        const newsToDelete = news.find(item => item.id === id);
        if (newsToDelete && newsToDelete.imageUrl) {
            const imageRef = ref(storage, newsToDelete.imageUrl);
            await deleteObject(imageRef).catch(err => console.error("Error deleting image:", err));
        }
        await deleteDoc(doc(db, "news", id));
        setNews(prev => prev.filter(item => item.id !== id));
    };
    
    const addDocument = async ({ title, file }) => {
        const filePath = `documents/${Date.now()}_${file.name}`;
        const fileRef = ref(storage, filePath);
        
        await uploadBytes(fileRef, file);
        const url = await getDownloadURL(fileRef);

        const newDoc = { title, url, filePath, createdAt: new Date() };
        const docRef = await addDoc(collection(db, "documents"), newDoc);
        
        setDocuments(prev => [{ id: docRef.id, ...newDoc }, ...prev]);
    };
    
    const deleteDocument = async (id, filePath) => {
        const fileRef = ref(storage, filePath);
        await deleteObject(fileRef).catch(err => console.error("Error deleting file:", err));
        await deleteDoc(doc(db, "documents", id));
        setDocuments(prev => prev.filter(doc => doc.id !== id));
    };

const addSurvey = async (survey) => {
        const newSurvey = { ...survey, createdAt: new Date() };
        const docRef = await addDoc(collection(db, "surveys"), newSurvey);
        setSurveys(prev => [{ id: docRef.id, ...newSurvey }, ...prev]);
    };

    const deleteSurvey = async (id) => {
        await deleteDoc(doc(db, "surveys", id));
        setSurveys(prev => prev.filter(survey => survey.id !== id));
    };

    const addComplaint = async (complaint) => {
        const newComplaint = { ...complaint, createdAt: serverTimestamp(), status: 'pending' };
        await addDoc(collection(db, "complaints"), newComplaint);
        
        // FIX: Only fetch the updated list if the user is an Admin (logged in).
        // Standard users don't need to see the list of complaints.
        if (user) {
            const complaintsSnapshot = await getDocs(query(collection(db, "complaints"), orderBy("createdAt", "desc")));
            setComplaints(complaintsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        }
    };

    const updateComplaintStatus = async (id, newStatus) => {
        const complaintRef = doc(db, "complaints", id);
        await updateDoc(complaintRef, { status: newStatus });
        setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    };

    const deleteComplaint = async (id) => {
        await deleteDoc(doc(db, "complaints", id));
        setComplaints(prev => prev.filter(c => c.id !== id));
    };

// --- NEW: Function to handle uploading the fees JSON ---
    const handleFeesUpload = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const jsonData = JSON.parse(event.target.result);
                    if (!Array.isArray(jsonData)) {
                        throw new Error("JSON file must be an array.");
                    }

                    // This function will upload all items. 
                    // For monthly updates, you should ideally clear the old collection first
                    // or use a unique ID (like propertyNumber) to 'set' (overwrite) docs.
                    // For simplicity, this example uses batch 'add'.
                    
                    // A more robust solution would be to 'set' with propertyNumber as the doc ID.
                    // Example: doc(db, "dueFees", item.propertyNumber)
                    
                    const batch = writeBatch(db);
                    const feesCollection = collection(db, "dueFees");

                    // To be safe, let's delete all existing documents first.
                    // THIS IS DESTRUCTIVE AND REPLACES ALL DATA.
                    console.log("Deleting old fees data...");
                    const oldDocsSnapshot = await getDocs(feesCollection);
                    oldDocsSnapshot.forEach(doc => {
                        batch.delete(doc.ref);
                    });
                    
                    console.log("Adding new fees data...");
                    jsonData.forEach(item => {
                        // Ensure data is clean
                        const newFeeEntry = {
                            fullName: String(item.fullName || ''),
                            propertyNumber: String(item.propertyNumber || ''),
                            location: String(item.location || ''),
                            dueFee: Number(item.dueFee || 0),
                            updatedAt: serverTimestamp()
                        };
                        
                        // Use propertyNumber as the document ID to prevent duplicates
                        // and allow for easy overwrites.
                        const docRef = doc(db, "dueFees", newFeeEntry.propertyNumber);
                        batch.set(docRef, newFeeEntry);
                    });

                    // Commit the batch
                    await batch.commit();
                    console.log("Batch commit successful.");
                    resolve();

                } catch (err) {
                    console.error("Error parsing JSON or uploading to Firestore: ", err);
                    reject(err);
                }
            };
            reader.onerror = (err) => reject(err);
            reader.readAsText(file);
        });
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
            case 'fees': return <DueFeesPage />;
            case 'contact': return <ContactPage />;
            case 'surveys': return <ComplaintsAndSurveysPage surveys={surveys} addComplaint={addComplaint} />;
            case 'admin': return <AdminPage 
                                    user={user} 
                                    handleLogin={handleLogin} 
                                    handleLogout={handleLogout}
                                    news={news}
                                    documents={documents}
                                    surveys={surveys}
                                    complaints={complaints}
                                    addNews={addNews}
                                    deleteNews={deleteNews}
                                    addDocument={addDocument}
                                    deleteDocument={deleteDocument}
                                    addSurvey={addSurvey}
                                    deleteSurvey={deleteSurvey}
                                    updateComplaintStatus={updateComplaintStatus}
                                    deleteComplaint={deleteComplaint}
                                    handleFeesUpload={handleFeesUpload}
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
