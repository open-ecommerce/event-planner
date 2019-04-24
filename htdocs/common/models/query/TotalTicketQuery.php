<?php

namespace common\models\query;

/**
 * This is the ActiveQuery class for [[qry_total_tickets]].
 *
 * @see Country
 */
class TotalTicketQuery extends \yii\db\ActiveQuery
{

    /**
     * @inheritdoc
     * @return TotalTickets[]|array
     */
    public function all($db = null)
    {
        return parent::all($db);
    }

    /**
     * @inheritdoc
     * @return TotalTickets|array|null
     */
    public function one($db = null)
    {
        return parent::one($db);
    }
}
