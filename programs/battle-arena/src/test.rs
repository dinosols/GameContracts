#[cfg(test)]
mod tests {
    use std::mem;
    use std::assert_eq;
    use field_offset::offset_of;
    use {
        crate::{
            state::{
                //MoveID,
                Move,
                MAX_MOVE_SIZE,
                Player,
                MAX_PLAYER_SIZE,
                Status,
                Battle,
                MAX_BATTLE_LEN,
            }
        }
    };

    #[test]
    fn struct_sizes() {
        // assert_eq!(offset_of!(Battle => experience).get_byte_offset(), 96);

        assert_eq!(MAX_MOVE_SIZE, mem::size_of::<Move>());
        assert_eq!(MAX_PLAYER_SIZE, mem::size_of::<Player>());
        assert_eq!(4, mem::size_of::<Status>());
        assert_eq!(MAX_BATTLE_LEN, mem::size_of::<Battle>())
    }
}