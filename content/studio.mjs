export const studioPath = (lang) => `${lang==='fa'?'/fa':''}/playground/`;
export const profilePath = (lang) => `${lang==='fa'?'/fa':''}/tools/profile-text/`;
export const studioTools = [
 {id:'profile',en:'Profile text studio',fa:'متن‌ساز پروفایل',enText:'Turn a name into copyable frames, styled letters and ASCII art.',faText:'نام خود را به قاب متنی، حروف تزئینی و طرح ASCII تبدیل کنید.',symbol:'Aa'},
 {id:'map',en:'Connected skills',fa:'نقشهٔ مهارت‌ها',enText:'Follow the connections between my tools and real projects.',faText:'ارتباط فناوری‌ها و پروژه‌های واقعی من را کشف کنید.',symbol:'⌘'},
 {id:'bug',en:'Find the broken circuit',fa:'مدار خراب را پیدا کنید',enText:'Repair three circuits and beat your personal best.',faText:'سه مدار را تعمیر کنید و رکورد شخصی خود را بهبود دهید.',symbol:'◇'},
 {id:'builder',en:'Sketch your project',fa:'نقشهٔ پروژهٔ شما',enText:'Choose features, connect the pieces and save your brief.',faText:'امکانات را انتخاب کنید، نقشه را ببینید و خلاصهٔ پروژه را ذخیره کنید.',symbol:'+'},
 {id:'request',en:'Behind one click',fa:'پشت یک کلیک',enText:'Follow a request through a browser, an API and a database.',faText:'مسیر یک درخواست را از مرورگر تا API و پایگاه داده دنبال کنید.',symbol:'◎'},
 {id:'signature',en:'Your light signature',fa:'امضای نوری شما',enText:'Make a circuit artwork from your name and take it with you.',faText:'با نام خود یک طرح مداری بسازید و تصویرش را دریافت کنید.',symbol:'✦'},
];
export const toolHref = (lang,id) => id==='profile'?profilePath(lang):studioPath(lang)+'#'+id;
export const STUDIO_SEO = {
 playground:{
  en:{title:'Interactive Playground | Mehdi Eslami',description:'Explore Mehdi Eslami’s interactive playground: connect skills and projects, repair circuits, sketch a project, simulate API requests and create a light signature.',heading:'A little curiosity. A working circuit.',intro:'Connect ideas, repair a circuit or make something to keep. Pick a small experiment and see what happens.'},
  fa:{title:'فضای تعاملی مهدی اسلامی | بازی مدار و ابزارهای خلاقانه',description:'فضای تعاملی مهدی اسلامی؛ نقشهٔ مهارت‌ها، بازی تعمیر مدار، ساخت نقشهٔ پروژه، شبیه‌ساز درخواست API و ساخت امضای نوری با نام شما.',heading:'کشف کنید، بسازید، امتحان کنید.',intro:'ارتباط‌ها را پیدا کنید، یک مدار را تعمیر کنید یا طرحی برای خود بسازید. از هر بخشی که دوست دارید شروع کنید.'}
 },
 profile:{
  en:{title:'Fancy Profile Text & ASCII Name Generator | Mehdi Eslami',description:'Create and copy fancy profile names, Unicode lettering, text frames and ASCII art. Supports Persian and English names for social profiles and bios. Free online tool.',heading:'Your name. A different expression.',intro:'Write a name or a short phrase. Choose a frame, styled lettering or an ASCII design, then copy it into your profile or bio.'},
  fa:{title:'متن‌ساز پروفایل و اسم فانتزی فارسی و انگلیسی | مهدی اسلامی',description:'ساخت و کپی اسم فانتزی، متن تزئینی پروفایل، قاب متنی و متن اسکی (ASCII) برای بیو و نام شبکه‌های اجتماعی؛ ابزار رایگان فارسی و انگلیسی مهدی اسلامی.',heading:'نام شما، با حال‌وهوای خودتان.',intro:'نام یا یک عبارت کوتاه بنویسید. قاب متنی، حروف تزئینی یا متن اسکی (ASCII) دلخواه را انتخاب و برای پروفایل و بیو کپی کنید.'}
 }
};
