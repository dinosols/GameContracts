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
                MoveID,
                Move,
                MAX_MOVE_SIZE,
                GameMetadata,
                MAX_GAME_METADATA_LEN,
            }
        }
    };

    #[test]
    fn struct_sizes() {
        assert_eq!(MAX_STATS_SIZE, mem::size_of::<Stats>());
        //assert_eq!(offset_of!(GameMetadata => baseStats).get_byte_offset(), 0);
        assert_eq!(offset_of!(Stats => experience).get_byte_offset(), 0);
        assert_eq!(offset_of!(Stats => level).get_byte_offset(), 4);
        assert_eq!(offset_of!(Stats => health).get_byte_offset(), 6);
        assert_eq!(offset_of!(Stats => attack).get_byte_offset(), 8);
        assert_eq!(offset_of!(Stats => defense).get_byte_offset(), 10);
        assert_eq!(offset_of!(Stats => speed).get_byte_offset(), 12);
        assert_eq!(offset_of!(Stats => agility).get_byte_offset(), 14);

        assert_eq!(4, mem::size_of::<StatusEffect>());
        assert_eq!(4, mem::size_of::<MoveID>());
        assert_eq!(MAX_MOVE_SIZE, mem::size_of::<Move>());
        assert_eq!(MAX_GAME_METADATA_LEN, mem::size_of::<GameMetadata>())
    }
}