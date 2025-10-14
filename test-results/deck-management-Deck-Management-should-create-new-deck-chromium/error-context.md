# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - navigation [ref=e3]:
      - generic [ref=e4]:
        - link "MtG Decks Builder" [ref=e6] [cursor=pointer]:
          - /url: /
          - generic [ref=e7]: MtG Decks Builder
        - generic [ref=e9]:
          - link "Zaloguj się" [ref=e10] [cursor=pointer]:
            - /url: /login
          - link "Zarejestruj się" [ref=e11] [cursor=pointer]:
            - /url: /register
  - main [ref=e12]:
    - generic [ref=e13]:
      - heading "Witaj w MTG Deck Builder" [level=1] [ref=e14]
      - paragraph [ref=e15]: Najpierw zaloguj się lub utwórz konto, aby móc przeglądać i tworzyć decki.
      - generic [ref=e16]:
        - link "Zaloguj się" [ref=e17] [cursor=pointer]:
          - /url: /login
        - link "Zarejestruj się" [ref=e18] [cursor=pointer]:
          - /url: /register
  - generic [ref=e21]:
    - button "Menu" [ref=e22]:
      - img [ref=e24]
      - generic: Menu
    - button "Inspect" [ref=e28]:
      - img [ref=e30]
      - generic: Inspect
    - button "Audit" [ref=e32]:
      - img [ref=e34]
      - generic: Audit
    - button "Settings" [ref=e37]:
      - img [ref=e39]
      - generic: Settings
```