#[cfg(test)]
mod tests {
    use std::mem;
    use std::assert_eq;
    use field_offset::offset_of;
    use {
        crate::{
            state::{
                Stats,
                MAX_STATS_SIZE,
                StatusEffect,
                Move,
                MAX_MOVE_SIZE,
                GameMetadata,
                MAX_GAME_METADATA_LEN,
            },
            instruction::{
                CreateMetadataAccountArgs,
            }
        }
    };

    #[test]
    fn struct_sizes() {
        assert_eq!(offset_of!(CreateMetadataAccountArgs => experience).get_byte_offset(), 0);
        assert_eq!(offset_of!(CreateMetadataAccountArgs => level).get_byte_offset(), 4);
        assert_eq!(offset_of!(CreateMetadataAccountArgs => base_stats).get_byte_offset(), 8);
        assert_eq!(offset_of!(CreateMetadataAccountArgs => level_stats).get_byte_offset(), 28);
        assert_eq!(offset_of!(CreateMetadataAccountArgs => curr_stats).get_byte_offset(), 48);
        assert_eq!(offset_of!(CreateMetadataAccountArgs => move0).get_byte_offset(), 72);

        assert_eq!(offset_of!(GameMetadata => schema_version).get_byte_offset(), 0);
        assert_eq!(offset_of!(GameMetadata => update_authority).get_byte_offset(), 4);
        assert_eq!(offset_of!(GameMetadata => player_authority).get_byte_offset(), 36);
        assert_eq!(offset_of!(GameMetadata => battle_authority).get_byte_offset(), 68);
        assert_eq!(offset_of!(GameMetadata => experience).get_byte_offset(), 100);
        assert_eq!(offset_of!(GameMetadata => level).get_byte_offset(), 104);
        assert_eq!(offset_of!(GameMetadata => base_stats).get_byte_offset(), 108);
        assert_eq!(offset_of!(GameMetadata => level_stats).get_byte_offset(), 128);
        assert_eq!(offset_of!(GameMetadata => curr_stats).get_byte_offset(), 148);
        assert_eq!(offset_of!(GameMetadata => move0).get_byte_offset(), 168);
        //assert_eq!(offset_of!(GameMetadata => move1).get_byte_offset(), 200);
        //assert_eq!(offset_of!(GameMetadata => move2).get_byte_offset(), 232);
        //assert_eq!(offset_of!(GameMetadata => move3).get_byte_offset(), 264);
        assert_eq!(MAX_STATS_SIZE, mem::size_of::<Stats>());
        //assert_eq!(offset_of!(Stats => experience).get_byte_offset(), 0);
        //assert_eq!(offset_of!(Stats => level).get_byte_offset(), 4);
        assert_eq!(offset_of!(Stats => health).get_byte_offset(), 0);
        assert_eq!(offset_of!(Stats => attack).get_byte_offset(), 4);
        assert_eq!(offset_of!(Stats => defense).get_byte_offset(), 8);
        assert_eq!(offset_of!(Stats => speed).get_byte_offset(), 12);
        assert_eq!(offset_of!(Stats => agility).get_byte_offset(), 16);

        assert_eq!(offset_of!(Move => move_name).get_byte_offset(), 0);
        assert_eq!(offset_of!(Move => status_effect).get_byte_offset(), 24);
        assert_eq!(offset_of!(Move => status_effect_chance).get_byte_offset(), 28);
        assert_eq!(offset_of!(Move => damage_modifier).get_byte_offset(), 29);
        assert_eq!(4, mem::size_of::<StatusEffect>());
        //assert_eq!(MAX_MOVE_SIZE, mem::size_of::<Move>());
        //assert_eq!(MAX_GAME_METADATA_LEN, mem::size_of::<GameMetadata>())
    }
}