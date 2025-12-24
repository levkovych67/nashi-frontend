import { ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-heading font-bold mb-4">Про нас</h1>
          <p className="text-xl text-muted-foreground">
            Платформа української культури та мистецтва
          </p>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Mission */}
          <Card className="p-8">
            <h2 className="text-3xl font-heading font-bold mb-4">Наша місія</h2>
            <p className="text-lg text-foreground/90 leading-relaxed">
              <strong>Наші</strong> - це культурна платформа, створена для підтримки та розвитку 
              української музичної сцени. Ми об'єднуємо артистів, організаторів подій та меломанів 
              у єдину спільноту, яка цінує автентичну українську культуру та сучасне мистецтво.
            </p>
          </Card>

          {/* What We Do */}
          <Card className="p-8">
            <h2 className="text-3xl font-heading font-bold mb-4">Що ми робимо</h2>
            <div className="space-y-4 text-lg text-foreground/90">
              <div className="flex items-start gap-3">
                <span className="text-accent text-2xl">🎨</span>
                <div>
                  <strong className="text-foreground">Каталог артистів</strong>
                  <p>Представляємо українських музикантів різних жанрів та стилів</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent text-2xl">🎭</span>
                <div>
                  <strong className="text-foreground">Події та концерти</strong>
                  <p>Інформуємо про культурні заходи по всій Україні</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent text-2xl">📻</span>
                <div>
                  <strong className="text-foreground">Радіо</strong>
                  <p>Транслюємо українську музику та підтримуємо локальних артистів</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-accent text-2xl">🗺️</span>
                <div>
                  <strong className="text-foreground">Інтерактивна карта</strong>
                  <p>Показуємо географічне розташування артистів та подій</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Community */}
          <Card className="p-8">
            <h2 className="text-3xl font-heading font-bold mb-4">Наша спільнота</h2>
            <p className="text-lg text-foreground/90 leading-relaxed mb-6">
              Ми віримо в силу спільноти та підтримки один одного. Приєднуйтесь до нас у Telegram, 
              щоб бути в курсі новин, обговорювати події та ділитися враженнями від концертів.
            </p>
            <a 
              href="https://t.me/nashiart" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block"
            >
              <Button size="lg" className="gap-2">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-1.902 8.983-2.687 11.919-.332 1.241-.983 1.656-1.613 1.696-.686.043-1.208-.456-1.873-.893-1.037-.686-1.622-1.113-2.625-1.782-1.159-.773-.409-1.198.254-1.892.173-.181 3.178-2.917 3.239-3.165.008-.031.015-.147-.055-.208-.07-.062-.173-.041-.247-.024-.106.024-1.792 1.139-5.058 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.441-.751-.244-1.348-.373-1.295-.787.027-.216.324-.437.889-.663 3.484-1.517 5.808-2.519 6.971-3.005 3.323-1.386 4.011-1.627 4.462-1.635.099-.002.321.023.465.14.121.099.154.232.17.326.014.094.032.308.018.475z"/>
                </svg>
                Приєднатися до Telegram
                <ExternalLink className="w-4 h-4" />
              </Button>
            </a>
          </Card>

          {/* Values */}
          <Card className="p-8">
            <h2 className="text-3xl font-heading font-bold mb-4">Наші цінності</h2>
            <div className="grid md:grid-cols-2 gap-6 text-lg">
              <div>
                <h3 className="font-heading font-semibold text-xl mb-2 text-accent">🇺🇦 Українськість</h3>
                <p className="text-foreground/90">Ми підтримуємо та популяризуємо українську культуру</p>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-xl mb-2 text-accent">🤝 Спільнота</h3>
                <p className="text-foreground/90">Разом ми сильніші - підтримуємо один одного</p>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-xl mb-2 text-accent">🎵 Різноманітність</h3>
                <p className="text-foreground/90">Цінуємо всі жанри від фолку до електроніки</p>
              </div>
              <div>
                <h3 className="font-heading font-semibold text-xl mb-2 text-accent">✨ Автентичність</h3>
                <p className="text-foreground/90">Підтримуємо справжнє та оригінальне мистецтво</p>
              </div>
            </div>
          </Card>

          {/* CTA */}
          <Card className="p-8 bg-gradient-to-br from-accent/10 to-accent/5 border-accent/30">
            <div className="text-center">
              <h2 className="text-3xl font-heading font-bold mb-4">Станьте частиною спільноти</h2>
              <p className="text-lg text-foreground/90 mb-6">
                Якщо ви артист, організатор подій або просто любите українську музику - 
                ми раді вітати вас у нашій спільноті!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="/submit">
                  <Button size="lg" variant="default">
                    Додати артиста або подію
                  </Button>
                </a>
                <a href="https://t.me/nashiart" target="_blank" rel="noopener noreferrer">
                  <Button size="lg" variant="outline" className="gap-2">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-1.902 8.983-2.687 11.919-.332 1.241-.983 1.656-1.613 1.696-.686.043-1.208-.456-1.873-.893-1.037-.686-1.622-1.113-2.625-1.782-1.159-.773-.409-1.198.254-1.892.173-.181 3.178-2.917 3.239-3.165.008-.031.015-.147-.055-.208-.07-.062-.173-.041-.247-.024-.106.024-1.792 1.139-5.058 3.345-.479.329-.913.489-1.302.481-.428-.009-1.252-.242-1.865-.441-.751-.244-1.348-.373-1.295-.787.027-.216.324-.437.889-.663 3.484-1.517 5.808-2.519 6.971-3.005 3.323-1.386 4.011-1.627 4.462-1.635.099-.002.321.023.465.14.121.099.154.232.17.326.014.094.032.308.018.475z"/>
                    </svg>
                    Telegram
                  </Button>
                </a>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
