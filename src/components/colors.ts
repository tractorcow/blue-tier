import { BulletType } from '@/lib/shaledb/types'
import { ArmorType } from '@prisma/client'
import { AllArmorType, AllType } from '@/lib/ranking/types'

export const bulletClasses: Record<BulletType, string> = {
  [BulletType.Normal]: 'bg-normal-light dark:bg-normal',
  [BulletType.Explosion]: 'bg-explosive-light dark:bg-explosive',
  [BulletType.Pierce]: 'bg-piercing-light dark:bg-piercing',
  [BulletType.Mystic]: 'bg-mystic-light dark:bg-mystic',
  [BulletType.Sonic]: 'bg-sonic-light dark:bg-sonic',
}

export const armorClasses: Record<AllArmorType, string> = {
  [ArmorType.Normal]: 'bg-normal-light dark:bg-normal',
  [ArmorType.LightArmor]: 'bg-explosive-light dark:bg-explosive',
  [ArmorType.HeavyArmor]: 'bg-piercing-light dark:bg-piercing',
  [ArmorType.Unarmed]: 'bg-mystic-light dark:bg-mystic',
  [ArmorType.ElasticArmor]: 'bg-sonic-light dark:bg-sonic',
  [AllType.All]: 'bg-normal-light dark:bg-normal',
}

export const cardBulletClasses: Record<BulletType, string> = {
  [BulletType.Normal]: 'border-t-normal border-l-normal',
  [BulletType.Explosion]: 'border-t-explosive border-l-explosive',
  [BulletType.Pierce]: 'border-t-piercing border-l-piercing',
  [BulletType.Mystic]: 'border-t-mystic border-l-mystic',
  [BulletType.Sonic]: 'border-t-sonic border-l-sonic',
}

export const cardArmorClasses: Record<ArmorType, string> = {
  [ArmorType.Normal]: 'border-r-normal border-b-normal',
  [ArmorType.LightArmor]: 'border-r-explosive border-b-explosive',
  [ArmorType.HeavyArmor]: 'border-r-piercing border-b-piercing',
  [ArmorType.Unarmed]: 'border-r-mystic border-b-mystic',
  [ArmorType.ElasticArmor]: 'border-r-sonic border-b-sonic',
}
