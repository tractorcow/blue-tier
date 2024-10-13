import { BulletType } from '@/lib/shaledb/types'
import { ArmorType } from '@prisma/client'
import { AllArmorType, AllType } from '@/lib/ranking/types'

export const bulletClasses: Record<BulletType, string> = {
  [BulletType.Normal]: 'bg-normal',
  [BulletType.Explosion]: 'bg-explosive',
  [BulletType.Pierce]: 'bg-piercing',
  [BulletType.Mystic]: 'bg-mystic',
  [BulletType.Elastic]: 'bg-sonic',
}

export const armorClasses: Record<AllArmorType, string> = {
  [ArmorType.Normal]: 'bg-normal',
  [ArmorType.LightArmor]: 'bg-explosive',
  [ArmorType.HeavyArmor]: 'bg-piercing',
  [ArmorType.Unarmed]: 'bg-mystic',
  [ArmorType.ElasticArmor]: 'bg-sonic',
  [AllType.All]: 'bg-normal',
}
