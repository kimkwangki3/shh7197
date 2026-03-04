import { ThemeProvider } from '../ThemeProvider';
import { Button } from "@/components/ui/button";
import { useTheme } from '../ThemeProvider';

function ThemeToggleButton() {
  const { theme, setTheme } = useTheme();
  
  return (
    <Button
      variant="outline"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      {theme === "light" ? "다크 모드" : "라이트 모드"}
    </Button>
  );
}

export default function ThemeProviderExample() {
  return (
    <ThemeProvider>
      <div className="p-8 space-y-4">
        <h2 className="text-2xl font-bold">테마 예시</h2>
        <p className="text-muted-foreground">테마 전환 기능을 테스트해보세요.</p>
        <ThemeToggleButton />
      </div>
    </ThemeProvider>
  );
}