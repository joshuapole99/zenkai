# Art Asset Inventory — Zenkai

All assets go in `/public/assets/`. Registry is in `lib/assets.ts`.

Naming convention: `{id}_{stage}_{pose}.png` for characters, `{id}_{pose}.png` for everything else.

---

## Characters (`/public/assets/characters/`)

Each class needs 3 stages × 4 poses = **12 sprites per class** (36 total).

### Striker
- [ ] `striker_weak_idle.png`
- [ ] `striker_weak_attack.png`
- [ ] `striker_weak_victory.png`
- [ ] `striker_weak_hit.png`
- [ ] `striker_normal_idle.png`
- [ ] `striker_normal_attack.png`
- [ ] `striker_normal_victory.png`
- [ ] `striker_normal_hit.png`
- [ ] `striker_strong_idle.png`
- [ ] `striker_strong_attack.png`
- [ ] `striker_strong_victory.png`
- [ ] `striker_strong_hit.png`

### Ninja
- [ ] `ninja_weak_idle.png`
- [ ] `ninja_weak_attack.png`
- [ ] `ninja_weak_victory.png`
- [ ] `ninja_weak_hit.png`
- [ ] `ninja_normal_idle.png`
- [ ] `ninja_normal_attack.png`
- [ ] `ninja_normal_victory.png`
- [ ] `ninja_normal_hit.png`
- [ ] `ninja_strong_idle.png`
- [ ] `ninja_strong_attack.png`
- [ ] `ninja_strong_victory.png`
- [ ] `ninja_strong_hit.png`

### Monk
- [ ] `monk_weak_idle.png`
- [ ] `monk_weak_attack.png`
- [ ] `monk_weak_victory.png`
- [ ] `monk_weak_hit.png`
- [ ] `monk_normal_idle.png`
- [ ] `monk_normal_attack.png`
- [ ] `monk_normal_victory.png`
- [ ] `monk_normal_hit.png`
- [ ] `monk_strong_idle.png`
- [ ] `monk_strong_attack.png`
- [ ] `monk_strong_victory.png`
- [ ] `monk_strong_hit.png`

**Stage rules:** Level 1–4 → weak · Level 5–9 → normal · Level 10+ → strong

---

## Enemies (`/public/assets/enemies/`)

3 poses each (idle, hit, defeat) = **12 sprites total**.

- [ ] `lazy_slime_idle.png`
- [ ] `lazy_slime_hit.png`
- [ ] `lazy_slime_defeat.png`
- [ ] `excuse_goblin_idle.png`
- [ ] `excuse_goblin_hit.png`
- [ ] `excuse_goblin_defeat.png`
- [ ] `tired_blob_idle.png`
- [ ] `tired_blob_hit.png`
- [ ] `tired_blob_defeat.png`
- [ ] `mini_shadow_idle.png`
- [ ] `mini_shadow_hit.png`
- [ ] `mini_shadow_defeat.png`

---

## NPC (`/public/assets/npc/`)

4 poses each (idle, talk, action, victory) = **8 sprites total**.

- [ ] `master_kael_idle.png`
- [ ] `master_kael_talk.png`
- [ ] `master_kael_action.png`
- [ ] `master_kael_victory.png`
- [ ] `rival_ryo_idle.png`
- [ ] `rival_ryo_talk.png`
- [ ] `rival_ryo_action.png`
- [ ] `rival_ryo_victory.png`

---

## Bosses (`/public/assets/bosses/`)

5 poses (idle, attack, special, rage, defeat) = **5 sprites total**.

- [ ] `shadow_general_idle.png`
- [ ] `shadow_general_attack.png`
- [ ] `shadow_general_special.png`
- [ ] `shadow_general_rage.png`
- [ ] `shadow_general_defeat.png`

---

## UI (`/public/assets/ui/`)

**7 sprites total.**

- [ ] `xp_bar_empty.png`
- [ ] `xp_bar_filled.png`
- [ ] `level_up_flash.png`
- [ ] `hp_bar.png`
- [ ] `hp_bar_low.png`
- [ ] `power_level_badge.png`
- [ ] `scan_overlay.png`

---

## Backgrounds (`/public/assets/backgrounds/`)

**7 sprites total.**

- [ ] `training_room.png`
- [ ] `city_rooftop.png`
- [ ] `night_street.png`
- [ ] `temple.png`
- [ ] `arena.png`
- [ ] `mountain.png`
- [ ] `boss_arena.png`

---

## Effects (`/public/assets/effects/`)

**5 sprites / spritesheets total.**

- [ ] `zenkai_boost.png`
- [ ] `level_up_flash.png`
- [ ] `hit_spark.png`
- [ ] `defeat_explosion.png`
- [ ] `power_charge.png`

---

## Icons (`/public/assets/icons/`)

**27 exercise icons total.**

- [ ] `exercise_01.png` — `exercise_02.png` — `exercise_03.png`
- [ ] `exercise_04.png` — `exercise_05.png` — `exercise_06.png`
- [ ] `exercise_07.png` — `exercise_08.png` — `exercise_09.png`
- [ ] `exercise_10.png` — `exercise_11.png` — `exercise_12.png`
- [ ] `exercise_13.png` — `exercise_14.png` — `exercise_15.png`
- [ ] `exercise_16.png` — `exercise_17.png` — `exercise_18.png`
- [ ] `exercise_19.png` — `exercise_20.png` — `exercise_21.png`
- [ ] `exercise_22.png` — `exercise_23.png` — `exercise_24.png`
- [ ] `exercise_25.png` — `exercise_26.png` — `exercise_27.png`

---

## Items (`/public/assets/items/`)

**4 sprites total.**

- [ ] `protein_shake.png`
- [ ] `energy_bar.png`
- [ ] `training_scroll.png`
- [ ] `xp_orb.png`

---

## Summary

| Category    | Files |
|-------------|-------|
| Characters  | 36    |
| Enemies     | 12    |
| NPC         | 8     |
| Bosses      | 5     |
| UI          | 7     |
| Backgrounds | 7     |
| Effects     | 5     |
| Icons       | 27    |
| Items       | 4     |
| **Total**   | **111** |
