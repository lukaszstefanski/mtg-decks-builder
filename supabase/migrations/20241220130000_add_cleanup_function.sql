-- =============================================================================
-- migracja: 20241220130000_add_cleanup_function.sql
-- cel: dodanie funkcji do czyszczenia danych testowych
-- uwagi: funkcja omija RLS i czyści wszystkie tabele związane z testami
-- =============================================================================

-- funkcja do czyszczenia danych testowych
-- omija RLS i usuwa wszystkie dane z tabel związanych z deckami
create or replace function cleanup_test_data()
returns void
language plpgsql
security definer -- pozwala ominąć RLS
as $$
begin
    -- usuń wszystkie dane z tabel w odpowiedniej kolejności (zgodnie z foreign keys)
    delete from deck_statistics;
    delete from deck_cards;
    delete from decks;
    delete from cards;
    delete from card_images;
    delete from users;
    
    -- zresetuj sekwencje (jeśli istnieją)
    -- resetuj sekwencje dla tabel z auto-increment
    -- (w naszym przypadku używamy UUID, więc nie ma sekwencji do resetowania)
    
    raise notice 'Dane testowe zostały wyczyszczone';
end;
$$;

-- komentarz do funkcji
comment on function cleanup_test_data() is 'Funkcja do czyszczenia danych testowych - omija RLS i usuwa wszystkie dane z tabel związanych z deckami';
