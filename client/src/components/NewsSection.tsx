import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ExternalLink, Newspaper, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

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
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerSlide = 4;
  
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
  
  const totalSlides = Math.ceil(newsArticles.length / itemsPerSlide);
  
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };
  
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };
  
  const getCurrentItems = () => {
    const start = currentSlide * itemsPerSlide;
    const end = start + itemsPerSlide;
    return newsArticles.slice(start, end);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "봉사활동":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "지역발전":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "사회공헌":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "주민권익":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      case "환경활동":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300";
      case "조직운영":
        return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
    }
  };

  return (
    <section id="news" className="py-20 bg-muted/20" data-testid="news-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-3 mb-6">
            <Newspaper className="w-8 h-8 text-primary" />
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
              언론 보도
            </h2>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            지역 사회 발전을 위한 활동과 주민들의 권익 보호를 위한 노력들이 언론을 통해 소개되었습니다.
          </p>
        </motion.div>

        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Controls */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                {currentSlide + 1} / {totalSlides} 페이지
              </span>
              <span className="text-sm text-muted-foreground">
                총 {newsArticles.length}개 기사
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={prevSlide}
                disabled={currentSlide === 0}
                className="gap-2"
                data-testid="button-prev-slide"
              >
                <ChevronLeft className="w-4 h-4" />
                이전
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={nextSlide}
                disabled={currentSlide === totalSlides - 1}
                className="gap-2"
                data-testid="button-next-slide"
              >
                다음
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* News Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {getCurrentItems().map((article, index) => (
              <motion.div
                key={`${currentSlide}-${article.id}`}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full hover-elevate transition-all duration-300" data-testid={`news-article-${article.id}`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(article.category)}`}>
                        {article.category}
                      </span>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {article.date}
                      </div>
                    </div>
                    <CardTitle className="text-lg leading-tight line-clamp-2">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {article.summary}
                    </p>
                    <div className="flex items-center justify-between pt-2">
                      <span className="text-sm font-medium text-primary">
                        {article.source}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => window.open(article.link, '_blank')}
                        data-testid={`button-read-more-${article.id}`}
                      >
                        <span>원문 보기</span>
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                  index === currentSlide
                    ? 'bg-primary'
                    : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                }`}
                data-testid={`slide-indicator-${index}`}
              />
            ))}
          </div>
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground">
            지역 사회 발전과 주민들의 권익을 위한 지속적인 활동을 이어나가겠습니다.
          </p>
        </motion.div>
      </div>
    </section>
  );
}