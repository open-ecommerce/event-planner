<?php

use yii\db\Schema;
use yii\db\Migration;

class m170302_210738_rbac_auth_assignment extends Migration
{

    public function init()
    {
        $this->db = 'db';
        parent::init();
    }

    public function safeUp()
    {
        $tableOptions = 'ENGINE=InnoDB';

        $this->createTable(
            '{{%rbac_auth_assignment}}',
            [
                'item_name'=> $this->string(64)->notNull(),
                'user_id'=> $this->string(64)->notNull(),
                'created_at'=> $this->integer(11)->null()->defaultValue(null),
            ],$tableOptions
        );
    }

    public function safeDown()
    {
        $this->dropTable('{{%rbac_auth_assignment}}');
    }
}
