import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, ExternalLink, Newspaper, ChevronLeft, ChevronRight } from "lucide-react";

interface NewsArticle {
  id: number;
  title: string;
  summary: string;
  date: string;
  source: string;
  link: string;
  category: string;
}

export default function NewsSection() {
  const newsArticles: NewsArticle[] = [
    {
      id: 1,
      title: "순천농협 신대지점 '깨끗한 신대만들기' 행사",
      summary: "순천농협 신대지점과 신대지구 발전 위원회가 합동으로 환경 정화 캠페인을 실시하며 지역 사회 발전에 기여했습니다.",
      date: "2022.01.24",
      source: "KJ Daily",
      link: "http://m.kjdaily.com/article.php?aid=1643019495565937062",
      category: "환경활동"
    },
    {
      id: 2,
      title: "신대지구 발전 위원회, 취약 계층을 위해 110만원 상당 라면 전달",
      summary: "코로나19로 어려운 상황에서 독거 노인과 취약 계층을 위해 라면 40박스를 해룡면 행정 복지 센터에 전달했습니다.",
      date: "2021.07.12",
      source: "NSPNA",
      link: "https://www.nspna.com/news/?mode=view&newsid=514069",
      category: "사회공헌"
    },
    {
      id: 3,
      title: "순천시 신대지구 발전 위원회, 헌혈 나눔 행사 개최",
      summary: "코로나19 혈액 수급난 해소를 위해 위원과 주민들이 참여한 헌혈 릴레이를 진행했습니다.",
      date: "2021.06.15",
      source: "데일리한국",
      link: "https://daily.hankooki.com/news/articleView.html?idxno=720448",
      category: "봉사활동"
    },
    {
      id: 4,
      title: "순천시 신대지구 E1 부지 \"장석웅 교육감, 학생들 피해 없도록 검토하겠다\"",
      summary: "비상 대책 위원회와 전남도 교육감 면담에서 교육 영향 평가를 전문 기관에서 검토하고 학생 피해를 최소화하겠다는 입장을 밝혔습니다.",
      date: "2021.01.27",
      source: "프레시안",
      link: "https://n.news.naver.com/article/002/0002170556",
      category: "지역발전"
    },
    {
      id: 5,
      title: "[TF이슈] 순천시 신대지구 E1부지 초고층 오피스텔 신축 가능할까?",
      summary: "49층 오피스텔 추진 경위와 주민 반대, 교육·교통 영향 평가 등 주요 쟁점들을 종합적으로 정리했습니다.",
      date: "2021.01.25",
      source: "더팩트",
      link: "https://m.tf.co.kr/read/national/1839397.htm",
      category: "지역발전"
    },
    {
      id: 6,
      title: "순천 신대지구 공공 시설 부지에 고층 오피스텔 몰래 신축 \"마찰\"",
      summary: "E1부지 49층 오피스텔 추진 논란으로 비상 대책 위원회가 발족되고 광양만 경제 자유 구역청과의 마찰이 일고 있습니다.",
      date: "2021.01.01",
      source: "프레시안",
      link: "https://m.pressian.com/m/pages/articles/2020123118572593221",
      category: "지역발전"
    },
    {
      id: 7,
      title: "순천 신대지구 발전 위원회의 '행복한 미래 여는 아름다운 봉사'",
      summary: "어르신 장수 사진 촬영, 교통 문화 캠페인, 환경 정화, 헌혈 등 지속적인 봉사 활동을 소개했습니다.",
      date: "2020.10.23",
      source: "YSIBTV",
      link: "https://www.ysibtv.co.kr/bbs/board.php?bo_table=news&wr_id=7589",
      category: "봉사활동"
    },
    {
      id: 8,
      title: "순천시 신대지구 지역민 '사랑의 헌혈' 운동 참여",
      summary: "신대지구 발전 위원회 주관으로 코로나19로 부족한 혈액 수급을 위해 헌혈 운동을 펼쳤으며, 39명이 헌혈에 참여했습니다.",
      date: "2020.05.22",
      source: "프레시안",
      link: "https://n.news.naver.com/article/002/0002135262",
      category: "봉사활동"
    },
    {
      id: 9,
      title: "순천 신대지구 발전 위원회 제5기 발대식 가져",
      summary: "신대지구 발전 위원회 제5기 회장단 발대식 및 신입 회원 환영 행사가 열렸으며, 홍성훈 위원장이 재신임되었습니다.",
      date: "2020.04.26",
      source: "프레시안",
      link: "https://m.pressian.com/m/pages/articles/2020042620162420762",
      category: "조직운영"
    },
    {
      id: 10,
      title: "중흥건설그룹 '사기 분양' 논란…과장 광고와 부당 이득에 뿔난 입주민 소송",
      summary: "중흥건설의 허위·과장 광고 논란과 부실 시공 문제에 대응하여 신대지구 발전 위원회를 발족하고 적극 대응했습니다.",
      date: "2017.01.31",
      source: "조선비즈",
      link: "https://biz.chosun.com/site/data/html_dir/2017/01/29/2017012900700.html",
      category: "주민권익"
    }
  ];

  // Group articles by category
  const categories = Array.from(new Set(newsArticles.map(a => a.category)));

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "봉사활동": return "text-blue-600 bg-blue-50";
      case "지역발전": return "text-emerald-600 bg-emerald-50";
      case "사회공헌": return "text-purple-600 bg-purple-50";
      case "주민권익": return "text-amber-600 bg-amber-50";
      case "환경활동": return "text-cyan-600 bg-cyan-50";
      case "조직운영": return "text-indigo-600 bg-indigo-50";
      default: return "text-slate-600 bg-slate-50";
    }
  };

  return (
    <section id="news" className="py-20 bg-white overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-sm font-bold mb-6">
            <Newspaper className="w-4 h-4" />
            <span>PRESS NEWS</span>
          </div>
          <h2 className="text-3xl lg:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            활동 기록 및 <span className="text-primary italic">언론 보도</span>
          </h2>
        </motion.div>

        <div className="space-y-16">
          {categories.map((category, catIdx) => (
            <NewsCategoryRow
              key={category}
              category={category}
              catIdx={catIdx}
              articles={newsArticles.filter(a => a.category === category)}
              getCategoryColor={getCategoryColor}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

interface CategoryRowProps {
  key?: string;
  category: string;
  catIdx: number;
  articles: NewsArticle[];
  getCategoryColor: (cat: string) => string;
}

function NewsCategoryRow({ category, catIdx, articles, getCategoryColor }: CategoryRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftBtn, setShowLeftBtn] = useState(false);
  const [showRightBtn, setShowRightBtn] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftBtn(scrollLeft > 10);
      setShowRightBtn(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => handleScroll(), 100);
    window.addEventListener('resize', handleScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleScroll);
    };
  }, [articles]);

  const scrollBy = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ delay: catIdx * 0.1 }}
        viewport={{ once: true }}
      >
        <div className={`w-1 h-6 rounded-full ${getCategoryColor(category).split(' ')[1]}`} />
        <h3 className="text-xl font-bold text-slate-900">{category}</h3>
        <span className="text-sm text-slate-400 font-medium">
          {articles.length}건
        </span>
      </motion.div>

      <div className="relative group/slider">
        {/* Navigation Buttons */}
        <AnimatePresence>
          {articles.length > 1 && showLeftBtn && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => scrollBy(-300)}
              className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-slate-100 rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-primary transition-all shadow-md active:scale-95"
            >
              <ChevronLeft className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {articles.length > 1 && showRightBtn && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={() => scrollBy(300)}
              className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white border border-slate-100 rounded-full shadow-lg flex items-center justify-center text-slate-600 hover:text-primary transition-all shadow-md active:scale-95"
            >
              <ChevronRight className="w-6 h-6" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Horizontal Scroll Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x px-1"
        >
          {articles.map((article, idx) => (
            <motion.div
              key={article.id}
              className="min-w-[280px] sm:min-w-[320px] snap-start"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-slate-100 shadow-sm hover:shadow-md transition-all group flex flex-col">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {article.date}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 uppercase letter-spacing-widest">
                      {article.source}
                    </span>
                  </div>
                  <CardTitle className="text-base font-bold text-slate-900 leading-snug group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                    {article.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-5 pb-5 pt-0 flex-1 flex flex-col justify-between">
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-6">
                    {article.summary}
                  </p>
                  <div className="pt-4 border-t border-slate-50 flex justify-end">
                    <a
                      href={article.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-primary group/link"
                    >
                      {article.source}에서 원문 보기
                      <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}