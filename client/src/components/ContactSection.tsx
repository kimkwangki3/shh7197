import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Instagram, 
  Youtube
} from "lucide-react";

export default function ContactSection() {
  const contactInfo = [
    {
      icon: Phone,
      title: "전화",
      content: "010-3641-0735",
      description: "업무 시간 중 연락 가능"
    },
    {
      icon: Mail,
      title: "이메일",
      content: "shh7197@naver.com",
      description: "언제든지 연락 가능"
    },
    {
      icon: MapPin,
      title: "직장",
      content: "㈜포스코 플랜텍",
      description: "전라남도 광양시"
    }
  ];

  const socialLinks = [
    { icon: Facebook, name: "페이스북", href: "#", color: "text-blue-400" },
    { icon: Instagram, name: "인스타그램", href: "https://www.instagram.com/hongseonghun8064/", color: "text-pink-400" },
    { icon: Youtube, name: "유튜브", href: "#", color: "text-red-400" }
  ];

  return (
    <section id="contact" className="py-20 bg-background" data-testid="contact-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
            연락처
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            언제든지 편하게 연락주세요.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Contact Information */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {contactInfo.map((info, index) => (
              <Card key={index} className="text-center hover-elevate" data-testid={`contact-info-${index}`}>
                <CardHeader className="pb-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                    <info.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{info.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold text-primary mb-2">{info.content}</p>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Social Media */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">소셜미디어</CardTitle>
                <p className="text-sm text-muted-foreground">
                  일상과 업무를 공유합니다
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex justify-center space-x-6">
                  {socialLinks.map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      className="flex flex-col items-center space-y-2 p-3 rounded-lg hover-elevate group"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      data-testid={`social-link-${index}`}
                    >
                      <social.icon className={`h-7 w-7 ${social.color} group-hover:scale-110 transition-transform`} />
                      <span className="text-sm font-medium text-foreground">{social.name}</span>
                    </motion.a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}